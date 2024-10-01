import Lottie from 'react-lottie-player'
import animationData from '../public/lotties/loading.json';

export default function FullPageLoader() {
    return (
        <div className="transition-all flex my-[40vh]">
            <div className="m-auto flex flex-col text-lts">
                <Lottie
                    id="lottie-animation"
                    loop="2"
                    animationData={animationData}
                    play
                    style={{width: '70px', height: '70px'}}
                />
                <div className="mt-2 mx-auto text-sm">Loading</div>
            </div>
        </div>
    );
};
