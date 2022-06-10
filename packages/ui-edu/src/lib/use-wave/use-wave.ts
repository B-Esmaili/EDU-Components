import { PropType } from '@atomic-web/ui-core';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Region, RegionParams } from 'wavesurfer.js/src/plugin/regions';
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
  regions: Region[];
  removeRegion: (id: string) => void;
  updateRegion: (params: RegionParams) => void;
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
      container: element,
      plugins: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        WaveSurferRegion.create({}),
      ],
    }) as WaveSurferWithPlugins;
    instanceMap.set(element, instance);
  }
  return instance;
};

const useWave = (options: useWaveOptions): UseWaveReturn => {
  const { containerRef, options: waveOptions } = options;
  const waveRef = useRef<WaveSurferWithPlugins>();
  const [instance, setInstance] = useState<WaveSurferWithPlugins | null>(null);
  const [regions, updateRegions] = useState<Region[]>([]);

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

  const removeRegion = (id: string) => {
    const region = regions.find((r) => r.id === id);
    if (region) {
      region.remove();
    }
  };

  const updateRegion = (params: RegionParams) => {
    if (!params.id) {
      return;
    }
    const region = regions.find((r) => r.id === params.id);

    if (region) {
      region.update(params);
    }
  };

  useEffect(() => {
    (async () => {
      if (!containerRef.current) {
        return;
      }

      const container = containerRef.current;

      const wave = getWaverInstance(waveOptions, container);

      wave.on('region-created', (nr: Region) => {
        updateRegions((r) => [...r, nr]);
      });

      wave.on('region-removed', (ur: Region) => {
        updateRegions((rs) => rs.filter((r) => r.id !== ur.id));
      });

      wave.on('region-update-end', (ur: Region) => {
        updateRegions((rs) => rs.map((r) => (r.id === ur.id ? ur : r)));
      });

      if (!instance) {
        setInstance(wave);
      }
      waveRef.current = wave;

      return () => {
        if (container && wave) {
          if (instanceMap.has(container)) {
            instanceMap.delete(container);
          }
          WaveSurferObj.destroy();
        }
      };
    })();
  }, [containerRef, instance, waveOptions]);

  return {
    load,
    instance,
    addRegion,
    clearRegions,
    regions,
    removeRegion,
    updateRegion,
  };
};

export { useWave };
