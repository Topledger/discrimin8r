import { Dialog } from "@headlessui/react";
import Lottie from 'react-lottie-player'
import animationData from '../public/lotties/loading.json';

export default function Loader(props) {
  return (
    <Dialog
      as="div"
      open={props.isLoading}
      className="relative z-50"
      onClose={() => {}}
    >
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center">
          <Lottie
              id="lottie-animation"
              loop="2"
              animationData={animationData}
              play
              style={{width: '70px', height: '70px'}}
          />
        </div>
      </div>
    </Dialog>
  );
}
