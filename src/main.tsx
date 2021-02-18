import Carousel from './Carousel';
import data from './carouselData.json';

function Main() {

  const handleNext = (index: number) => {
    console.log("handleNext => ", index);
  }

  const handlePrevious = (index: number) => {
    console.log("handlePrevious => ", index);
  }

  const handleIndicatorClick = (index: number) => {
    console.log("handleIndicatorClick => ", index);
  }

  return (
    <Carousel 
      data={JSON.parse(JSON.stringify(data))}
      // blocks={5}
      mobileBlocks={2}
      // showIndicator={false}
      // height={"500px"}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onIndicatorClick={handleIndicatorClick}
    />
  );
}

export default Main;
