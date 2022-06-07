import { PropType } from '@atomic-web/ui-core';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { isBrowserEnv } from '../../utils/misc/is-browser-env';
import { IRegion, RegionOptions } from './plugins';
import { Peaks, WaveSurferParams } from './wave-surfer';

type WaveSurferWithPlugins = WaveSurfer & IRegion;

const WaveSurferObj: WaveSurfer = isBrowserEnv()
  ? require('wavesurfer.js')
  : null;

const WaveSurferRegion: IRegion = isBrowserEnv()
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('wavesurfer.js/src/plugin/regions').default
  : null;

export interface useWaveOptions {
  containerRef: MutableRefObject<HTMLElement>;
  options: Omit<WaveSurferParams, 'container'>;
}

export type UseWaveReturn = IRegion & {
  instance: WaveSurfer | null;
  load: PropType<WaveSurfer, 'load'>;
};

const instanceMap = new Map<HTMLElement, WaveSurferWithPlugins>();

const getWaverInstance = (
  options: Omit<WaveSurferParams, 'container'>,
  element: HTMLElement
): WaveSurferWithPlugins => {
  let instance = instanceMap.get(element);
  if (!instance) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    instance = WaveSurferObj.create({
      ...options,
      container:element,
      plugins: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        WaveSurferRegion.create({}),
      ],
    }) as WaveSurferWithPlugins;
    instanceMap.set(element,instance);
  }
  return instance;
};

const useWave = (options: useWaveOptions): UseWaveReturn => {
  const { containerRef, options: waveOptions } = options;
  const waveRef = useRef<WaveSurferWithPlugins>();
  const [instance, setInstance] = useState<WaveSurferWithPlugins | null>(null);

  const load = (
    url: string | HTMLMediaElement,
    peaks?: Peaks,
    preload?: string,
    duration?: number | undefined
  ) => {
    if (waveRef.current) {
      waveRef.current.load(url, peaks, preload, duration);
      setInstance(waveRef.current);
    }
  };

  const addRegion = (options: RegionOptions) => {
    if (!waveRef.current) {
      return;
    }
    waveRef.current.addRegion?.(options);
  };

  const clearRegions = () => {
    if (!waveRef.current) {
      return;
    }
    waveRef.current.clearRegions?.();
  };

  useEffect(() => {
    (async () => {
      if (!containerRef.current) {
        return;
      }

      const container = containerRef.current;

      const wave = getWaverInstance(waveOptions, container);

      if (!instance) {
        setInstance(wave);
      }
      waveRef.current = wave;

      return () => {
        if (container && wave) {
          WaveSurferObj.destroy();
        }
      };
    })();
  }, [containerRef, instance, waveOptions]);

  return { load, instance, addRegion, clearRegions };
};

export { useWave };
