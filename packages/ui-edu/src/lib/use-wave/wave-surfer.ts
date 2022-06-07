export type Peaks =
  | ReadonlyArray<number>
  | ReadonlyArray<ReadonlyArray<number>>;

export interface PluginParams {
  [paramName: string]: unknown;
  /** Set to true to manually call (default: false). */
  deferInit?: boolean | undefined;
}

declare class WaveSurferPlugin {
  constructor(params: Record<string, unknown>, ws: WaveSurfer);
  static create(params: Record<string, unknown>): PluginDefinition;
  init(): void;
  destroy(): void;
}

export interface DrawingContextAttributes {
  desynchronized: boolean;
}

export interface PluginDefinition {
  /** The name of the plugin, the plugin instance will be added as a property to the wavesurfer instance under this name. */
  name: string;
  /** The properties that should be added to the wavesurfer instance as static properties. */
  staticProps?: { [staticPropName: string]: unknown } | undefined;
  /** Don't initialise plugin automatically. */
  deferInit?: boolean | undefined;
  /** The plugin parameters, they are the first parameter passed to the plugin class constructor function. */
  params: PluginParams;
  /** The plugin instance factory, is called with the dependency specified in extends. Returns the plugin class. */
  instance: {
    new (params: PluginDefinition['params'], ws: WaveSurfer): WaveSurferPlugin;
  };
}

export interface ChannelColor {
  progressColor: string;
  waveColor: string;
}

export interface SplitChannelOptions {
  /** Determines whether channels are rendered on top of each other or on separate tracks. */
  overlay?: boolean | undefined;
  /** Object describing color for each channel. */
  channelColors?: { [channel: number]: ChannelColor } | undefined;
  /** Indexes of channels to be hidden from rendering. */
  filterChannels?: number[] | undefined;
  /** Determines whether normalization is done per channel or maintains proportionality between channels. */
  relativeNormalization?: boolean | undefined;
}

type EventHandler = (...args: unknown[]) => void;
export interface ListenerDescriptor {
    /** The name of the event. */
    name: string;
    /** The callback. */
    callback: (...args: unknown[]) => void;
    /** The function to call to remove the listener. */
    un: () => void;
}

declare class Observer {
    constructor();
    /** Manually fire an event. */
    fireEvent(eventName: string, ...args: unknown[]): void;
    /** Attach a handler function for an event. */
    on(eventName: string, callback: EventHandler): ListenerDescriptor;
    /** Attach a handler to an event. */
    once(eventName: string, callback: EventHandler): ListenerDescriptor;
    /** Disable firing a list of events by name. */
    setDisabledEventEmissions(eventNames: string[]): void;
    /** Remove an event handler. */
    un(eventName: string, callback: EventHandler): void;
    /** Remove all event handlers. */
    unAll(): void;

    readonly handlers: { [eventName: string]: EventHandler[] };
}

export interface DrawParams {
    absmax: number;
    hasMinVals: boolean;
    height: number;
    offsetY: number;
    halfH: number;
    peaks: Peaks;
    channelIndex: number;
}

declare class Drawer extends Observer {
  constructor(container: HTMLElement, params: WaveSurferParams);

  readonly container: HTMLElement;
  /** The height of the renderer. */
  readonly height: number;
  readonly lastPos: number;
  readonly params: WaveSurferParams;
  /** The width of the renderer. */
  readonly width: number;
  readonly wrapper: HTMLElement;
}

declare class CanvasEntry {
    constructor();

    /** Set the canvas transforms for wave and progress. */
    applyCanvasTransforms(vertical: boolean): void;
    /** Clear the wave and progress rendering contexts. */
    clearWave(): void;
    /** Destroys this entry. */
    destroy(): void;
    /** Render the actual waveform line on a canvas element. */
    drawLineToContext(
        ctx: CanvasRenderingContext2D,
        peaks: number[],
        absmax: number,
        halfH: number,
        offsetY: number,
        start: number,
        end: number,
    ): void;
    /** Render the actual wave and progress lines. */
    drawLines(peaks: number[], absmax: number, halfH: number, offsetY: number, start: number, end: number): void;
    /** Draw a rounded rectangle on Canvas. */
    drawRoundedRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
    ): void;
    /** Draw the actual rectangle on a canvas element. */
    fillRectToContext(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
    ): void;
    /** Draw a rectangle for wave and progress. */
    fillRects(x: number, y: number, width: number, height: number, radius: number): void;
    /** Utility function to handle wave color arguments. */
    getFillStyle(ctx: CanvasRenderingContext2D, color: string): string | CanvasGradient;
    /** Return image data of the wave canvas element. */
    getImage(format: string, quality: number, type: string): string | Promise<string>;
    /** Store the progress wave canvas element and create the 2D rendering context. */
    initProgress(element: HTMLCanvasElement): string;
    /** Store the wave canvas element and create the 2D rendering context. */
    initWave(element: HTMLCanvasElement): string;
    /** Set the fill styles for wave and progress. */
    setFillStyles(waveColor: string, progressColor: string): void;
    /** Update the dimensions. */
    updateDimensions(elementWidth: number, totalWidth: number, width: number, height: number): void;

    /** Canvas 2d context attributes. */
    readonly canvasContextAttributes: DrawingContextAttributes;
    /** End of the area the canvas should render, between 0 and 1. */
    readonly end: number;
    /** Unique identifier for this entry. */
    readonly id: string;
    /** The (optional) progress wave node. */
    readonly progress: HTMLCanvasElement;
    /** The (optional) progress wave canvas rendering context. */
    readonly progressCtx: CanvasRenderingContext2D;
    /** Start of the area the canvas should render, between 0 and 1. */
    readonly start: number;
    /** The wave node. */
    readonly wave: HTMLCanvasElement;
    /** The wave canvas rendering context. */
    readonly waveCtx: CanvasRenderingContext2D;
}

declare class MultiCanvas extends Drawer {
  constructor(container: HTMLElement, params: WaveSurferParams);

  /** Add a canvas to the canvas list. */
  addCanvas(): void;
  /** Set the canvas transforms for a certain entry (wave and progress). */
  applyCanvasTransforms(entry: CanvasEntry, vertical: boolean): void;
  /** Clear the whole multi-canvas. */
  clearWave(): void;
  /** Create the canvas elements and style them. */
  createElements(): void;
  /** Draw a waveform with bars. */
  drawBars(
    peaks: Peaks,
    channelIndex: number,
    start: number,
    end: number
  ): void;
  /** Tell the canvas entries to render their portion of the waveform. */
  drawLine(
    peaks: number[],
    absmax: number,
    halfH: number,
    offsetY: number,
    start: number,
    end: number,
    channelIndex: number
  ): void;
  /** Draw a waveform. */
  drawWave(
    peaks: Peaks,
    channelIndex: number,
    start: number,
    end: number
  ): void;
  /** Draw a rectangle on the multi-canvas. */
  fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    channelIndex: number
  ): void;
  /** Return image data of the multi-canvas. */
  getImage(
    format: string,
    quality: number,
    type: string
  ): string | string[] | Promise<string | string[]>;
  /** Returns whether to hide the channel from being drawn based on params. */
  hideChannel(channelIndex: number): void;
  /** Initialize the drawer. */
  init(): void;
  /** Performs preparation tasks and calculations which are shared by drawBars and drawWave. */
  prepareDraw(
    peaks: Peaks,
    channelIndex: number,
    start: number,
    end: number,
    fn: (arg: DrawParams) => void,
    drawIndex: number,
    normalizedMax: number
  ): void;
  /** Pop single canvas from the list. */
  removeCanvas(): void;
  /** Set the fill styles for a certain entry (wave and progress). */
  setFillStyles(
    entry: CanvasEntry,
    waveColor: string,
    progressColor: string
  ): void;
  /** Update cursor style. */
  updateCursor(): void;
  /** Update the dimensions of a canvas element. */
  updateDimensions(entry: CanvasEntry, width: number, heihgt: number): void;
  /** Render the new progress. */
  updateProgress(position: number): void;
  /** Adjust to the updated size by adding or removing canvases. */
  updateSize(): void;

  /** Class used to generate entries. */
  readonly EntryClass: typeof CanvasEntry;
  /** The radius of the wave bars. */
  readonly barRadius: number;
  /** Canvas 2d context attributes. */
  readonly canvasContextAttributes: DrawingContextAttributes;
  readonly canvases: CanvasEntry[];
  readonly halfPixel: number;
  /** Whether or not the progress wave is rendered. */
  readonly hasProgressCanvas: boolean;
  readonly maxCanvasElementWidth: number;
  readonly maxCanvasWidth: number;
  /** Overlap added between entries to prevent vertical white stripes between canvas elements. */
  readonly overlap: number;
  readonly progressWave: HTMLElement;
  /** Whether to render the waveform vertically. */
  readonly vertical: boolean;
}
export interface XHRRequestHeader {
    key: string;
    value: string;
}

export interface XHROptions {
    url?: string | undefined;
    method?: string | undefined;
    mode?: string | undefined;
    credentials?: string | undefined;
    cache?: string | undefined;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | undefined;
    requestHeaders?: XHRRequestHeader[] | undefined;
    redirect?: string | undefined;
    referrer?: string | undefined;
    withCredentials?: boolean | undefined;
}

export interface WaveSurferParams {
  /** Use your own previously initialized AudioContext or leave blank (default: null). */
  audioContext?: AudioContext | undefined;
  /** Speed at which to play audio. Lower number is slower (default: 1). */
  audioRate?: number | undefined;
  /** Use your own previously initialized ScriptProcessorNode or leave blank (default: null). */
  audioScriptProcessor?: ScriptProcessorNode | undefined;
  /** If a scrollbar is present, center the waveform on current progress (default: true). */
  autoCenter?: boolean | undefined;
  /** If autoCenter is active, rate at which the waveform is centered (default: 5). */
  autoCenterRate?: number | undefined;
  /** If autoCenter is active, immediately center waveform on current progress (default: false). */
  autoCenterImmediately?: boolean | undefined;
  /**
   * Backend to use (default: 'WebAudio').
   *
   * MediaElement is a fallback for unsupported browsers.
   * MediaElementWebAudio allows to use WebAudio API also with big audio files, loading audio like with MediaElement backend (HTML5 audio tag).
   */
  backend?: 'WebAudio' | 'MediaElement' | 'MediaElementWebAudio' | undefined;
  /** Change background color of the waveform container (default: null). */
  backgroundColor?: string | undefined;
  /** The height of the wave bars (default: 1). */
  barHeight?: number | undefined;
  /** The radius of the wave bars (default: 0). Makes bars rounded. */
  barRadius?: number | undefined;
  /** The optional spacing between bars of the wave, if not provided will be calculated in legacy format (default: null). */
  barGap?: number | undefined;
  /** Draw the waveform using bars (default: null). */
  barWidth?: number | undefined;
  /** If specified, draw at least a bar of this height, eliminating waveform gaps (default: null). */
  barMinHeight?: number | undefined;
  /** Close and nullify all audio contexts when the destroy method is called (default: false). */
  closeAudioContext?: boolean | undefined;
  /** CSS selector or HTML element where the waveform should be drawn. This is the only required parameter. */
  container: string | HTMLElement;
  /** The fill color of the cursor indicating the playhead position (default: '#333'). */
  cursorColor?: string | undefined;
  /** Measured in pixels (default: 1). */
  cursorWidth?: number | undefined;
  drawingContextAttributes?: DrawingContextAttributes | undefined;
  /** Optional audio length so pre-rendered peaks can be display immediately for example (default: null). */
  duration?: number | undefined;
  /** Whether to fill the entire container or draw only according to minPxPerSec (default: true). */
  fillParent?: boolean | undefined;
  /** Force decoding of audio using web audio when zooming to get a more detailed waveform (default: false). */
  forceDecode?: boolean | undefined;
  /** The height of the waveform. Measured in pixels (default: 128). */
  height?: number | undefined;
  /** Whether to hide the mouse cursor when one would normally be shown by default (default: false). */
  hideCursor?: boolean | undefined;
  /** Whether to hide the horizontal scrollbar when one would normally be shown (default: false). */
  hideScrollbar?: boolean | undefined;
  /** If true, ignores device silence mode. */
  ignoreSilenceMode?: boolean | undefined;
  /** Whether the mouse interaction will be enabled at initialization. You can switch this parameter at any time later on (default: true). */
  interact?: boolean | undefined;
  /** (Use with regions plugin) Enable looping of selected regions (default: false). */
  loopSelection?: boolean | undefined;
  /** Maximum width of a single canvas in pixels (default: 4000). */
  maxCanvasWidth?: number | undefined;
  /** (Use with backend MediaElement or MediaElementWebAudio) Enable the native controls for the media element (default: false). */
  mediaControls?: boolean | undefined;
  /** (Use with backend MediaElement or MediaElementWebAudio) 'audio'|'video' ('video' only for MediaElement) */
  mediaType?: 'audio' | 'video' | undefined;
  /** Minimum number of pixels per second of audio (default: 20). */
  minPxPerSec?: number | undefined;
  /** If true, normalize by the maximum peak instead of 1.0 (default: false). */
  normalize?: boolean | undefined;
  /** Use the PeakCache to improve rendering speed of large waveforms (default: false). */
  partialRender?: boolean | undefined;
  /** The pixel ratio used to calculate display (default: window.deviceDixelRatio). */
  pixelRatio?: number | undefined;
  /** An array of plugin definitions to register during instantiation. */
  plugins?: PluginDefinition[] | undefined;
  /** The fill color of the part of the waveform behind the cursor (default: '#555'). */
  progressColor?: string | undefined;
  /** Set to false to keep the media element in the DOM when the player is destroyed (default: true). */
  removeMediaElementOnDestroy?: boolean | undefined;
  /** Can be used to inject a custom renderer (default: MultiCanvas). */
  renderer?: MultiCanvas | undefined;
  /**
   * If set to true resize the waveform, when the window is resized (default: false).
   *
   * This is debounced with a 100ms timeout by default. If this parameter is a number it represents that timeout.
   */
  responsive?: boolean | number | undefined;
  /** If set to true, renders waveform from right-to-left (default: false). */
  rtl?: boolean | undefined;
  /** Whether to scroll the container with a lengthy waveform. Otherwise the waveform is shrunk to the container width (see fillParent) (default: false). */
  scrollParent?: boolean | undefined;
  /** Number of seconds to skip with the skipForward() and skipBackward() methods (default: 2). */
  skipLength?: number | undefined;
  /** Render with separate waveforms for the channels of the audio (default: false). */
  splitChannels?: boolean | undefined;
  /** Options for splitChannel rendering. */
  splitChannelsOptions?: SplitChannelOptions | undefined;
  /** Render the waveform vertically instead of horizontally. */
  vertical?: boolean | undefined;
  /** The fill color of the waveform after the cursor. */
  waveColor?: string | CanvasGradient | undefined;
  /** XHR options. */
  xhr?: XHROptions | undefined;
}
