import { Button } from 'grommet';
import { useWave } from '@atomic-web/ui-edu';
import { useRef } from 'react';
import { Layout } from '../components/layout';

const WaveTest = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { load, instance, addRegion } = useWave({
    containerRef,
    options: {
      waveColor: 'violet',
      progressColor: 'purple',
    },
  });



  return (
    <Layout>
      <div ref={containerRef}></div>
      <Button label="load" onClick={() => load(prompt('?'))} />
      <Button label="play" onClick={() => {instance?.play()}} />
      <Button label="pause" onClick={() => instance?.pause()} />
      <Button label="add region" onClick={() => addRegion({
           start: 1,
           end: 3,
           color: 'hsla(400, 100%, 30%, 0.5)',
           id: "asdsad"
      })} />
    </Layout>
  );
};

export default WaveTest;
