import { Effect } from 'postprocessing'
import { Color, type Texture, Uniform, Vector2, Vector4 } from 'three'
import { BLEND } from '@/webgl/utils/blend'

// http://alex-charlton.com/posts/Dithering_on_the_GPU/
// https://surma.dev/things/ditherpunk/
// https://offscreencanvas.com/issues/glsl-dithering/

const fragmentShader = /* glsl */ `
    ${BLEND.NORMAL}

    uniform float uGammaCorrection;
    uniform float uOpacity;
    uniform vec3 uColor;
    uniform sampler2D uMatrixTexture;
    uniform vec2 uMatrixTextureSize;
    uniform bool uRandom;
    uniform float uGranularity;
    uniform vec4 d;

    float indexValue() {
      vec2 coords = mod(gl_FragCoord.xy / uGranularity, uMatrixTextureSize) / uMatrixTextureSize;
      return texture2D(uMatrixTexture, coords).r;
    }

    float dither(float value) {
        float threshold = uRandom ? rand(gl_FragCoord.xy * 10.) : indexValue();
        return (value <= threshold) ? 0. : 1.;
    }

    float gammaCorrection(float value, float gamma) {
        return pow(value, 1.0 / gamma);
    }

    float luminance(vec3 color) {
        return (color.r + color.g + color.b) / 3.;
    }

    // https://github.com/pmndrs/postprocessing/blob/main/src/effects/glsl/pixelation.frag
    vec2 pixelation(vec2 uv) {
      return d.xy * (floor((uv) * d.zw) + 0.5);
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 pixelsUv = pixelation(uv);
        vec3 rgb = texture2D(inputBuffer, pixelsUv).rgb;
        float grayscaled = luminance(rgb);

        vec3 grayscaledColor = vec3(grayscaled);

        float dithered = dither(gammaCorrection(grayscaled, uGammaCorrection));
        vec3 ditheredColor = vec3(dithered);

        vec3 color = blendNormal(grayscaledColor * uColor, ditheredColor + uColor, uOpacity);

        outputColor = vec4(color, inputColor.a);
    }
`

export interface DitheringEffectOptions {
  gammaCorrection?: number
  color?: Color
  opacity?: number
  granularity?: number
}

export class DitheringEffect extends Effect {
  private readonly resolution = new Vector2()
  private _granularity = 0

  constructor({
    gammaCorrection = 0.6,
    color = new Color(1, 1, 1),
    opacity = 1,
    granularity = 1,
  }: DitheringEffectOptions = {}) {
    super('DitheringEffect', fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ['uGammaCorrection', new Uniform(gammaCorrection)],
        ['uOpacity', new Uniform(opacity)],
        ['uColor', new Uniform(color)],
        ['uMatrixTexture', new Uniform(null)],
        ['uMatrixTextureSize', new Uniform(new Vector2())],
        ['uRandom', new Uniform(false)],
        ['uGranularity', new Uniform(granularity)],
        ['d', new Uniform(new Vector4())],
      ]),
    })

    // https://github.com/pmndrs/postprocessing/blob/main/src/effects/PixelationEffect.js
    this.granularity = granularity
  }

  set gammaCorrection(value: number) {
    this.uniforms.get('uGammaCorrection')!.value = value
  }

  set matrixTexture(value: Texture | null) {
    this.uniforms.get('uMatrixTexture')!.value = value
  }

  set matrixTextureSize(value: Vector2) {
    ;(this.uniforms.get('uMatrixTextureSize')!.value as Vector2).copy(value)
  }

  set random(value: boolean) {
    this.uniforms.get('uRandom')!.value = Boolean(value)
  }

  set color(value: Color) {
    ;(this.uniforms.get('uColor')!.value as Color).copy(value)
  }

  set opacity(value: number) {
    this.uniforms.get('uOpacity')!.value = value
  }

  get granularity(): number {
    return this._granularity
  }

  set granularity(value: number) {
    const d = Math.max(1, Math.floor(value))
    this._granularity = d
    this.setSize(this.resolution.width, this.resolution.height)
  }

  override setSize(width: number, height: number): void {
    this.resolution.set(width, height)

    const d = this._granularity
    const x = d / this.resolution.x
    const y = d / this.resolution.y
    const w = 1.0 / x
    const z = 1.0 / y
    ;(this.uniforms.get('d')!.value as Vector4).set(x, y, w, z)
    this.uniforms.get('uGranularity')!.value = d
  }
}
