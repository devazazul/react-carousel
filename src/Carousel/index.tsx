import React from 'react';
import './Carousel.css';

/**
 * @param title An string, display above the image, optional
 * @param images An array image urls, required
 */
interface Data {
  title?: string,
  images: string[],
}

/** 
 * @param data An array of carousel Data, required
 * @param blocks default 4, No of blocks showen at a time in large screen, optional
 * @param mobileBlocks default 1, No of blocks showen at a time in mobile screen, optional
 * @param height default "300px", An height of the Carousel, optional
 * @param showIndicator default true, set false if you don't want indicator, optional
 * @param onNext A callback method will be called on click of the next button, optional
 * @param onPrevious A callback method will be called on click of the previous button, optional
 * @param onIndicatorClick A callback method will be called on click of the indicator, optional
 */
export interface IProps {
  data: Data[],
  blocks?: number,
  mobileBlocks?: number,
  height?: string,
  showIndicator?: boolean,
  onNext?: any,
  onPrevious?: any,
  onIndicatorClick?: any,
}

/** 
 * @param data An array of carousel Data, required
 * @param blocks default 4, No of blocks showen at a time in large screen, optional
 * @param mobileBlocks default 1, No of blocks showen at a time in mobile screen, optional
 * @param height default "300px", An height of the Carousel, optional
 * @param showIndicator default true, set false if you don't want indicator, optional
 * @param onNext A callback method will be called on click of the next button, optional
 * @param onPrevious A callback method will be called on click of the previous button, optional
 * @param onIndicatorClick A callback method will be called on click of the indicator, optional
 * @returns Carousel JSX
 */
function Carousel(props: IProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [lastIndex, setLastIndex] = React.useState<number>(0);
  const [blockWidth, setBlockWidth] = React.useState<number>(25);
  const [currentBlocks, setCurrentBlocks] = React.useState<any>([]);
  
  /**
   * add event listener, which will call resizeBlockWidth (@see resizeBlockWidth) on resize of window
   */
  React.useEffect(() => {
    window.addEventListener('resize', resizeBlockWidth);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * calculate and set all data again on change of data
   */
  React.useEffect(() => {
    resizeBlockWidth();
  }, [props.data]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * fetch and set new blocks data on change of selectedIndex
   */
  React.useEffect(() => {
    setNewCurrentBlocks();
  }, [selectedIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * calcualte last index and set new blocks data on change of blockWidth
   */
  React.useEffect(() => {
    const newLastIndex = Math.ceil(props.data.length / (100 / blockWidth)) - 1;
    setLastIndex(newLastIndex);
    setNewCurrentBlocks();
    if (selectedIndex > newLastIndex) setSelectedIndex(newLastIndex);
  }, [blockWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * set current blocks when selectedIndex or blockWidth change
   */
  const setNewCurrentBlocks = () => {
    const firstBlock = selectedIndex * (100 / blockWidth);
    const lastBlock = (selectedIndex + 1) * (100 / blockWidth);
    const _currentBlocks: any = [];
    for (let i = firstBlock; i < lastBlock && i < props.data.length; i++) {
      _currentBlocks.push(props.data[i]);
    }
    setCurrentBlocks(_currentBlocks);
  }

  /**
   * resize block width according to client document width
   */
  const resizeBlockWidth = () => {
    if (document.documentElement.clientWidth <= 768) {
      setBlockWidth((100 / props.mobileBlocks!));
    } else {
      setBlockWidth((100 / props.blocks!));
    }
  }

  /**
   * @param images An array image urls, required
   * @returns random image from images
   */
  const getRandomImage = (images: string[]) => {
    return images[Math.floor(Math.random() * images.length)];
  }

  /**
   * called on click of the next button, set new selectedIndex and raise onNext callback method
   */
  const handleNext = () => {
    if (selectedIndex < lastIndex) {
      if (props.onNext) props.onNext(selectedIndex + 1);
      setSelectedIndex(selectedIndex + 1);
    }
  }

  /**
   * called on click of the previous button, set new selectedIndex and raise onPrevious callback method
   */
  const handlePrevious = () => {
    if (selectedIndex) {
      if (props.onPrevious) props.onPrevious(selectedIndex - 1);
      setSelectedIndex(selectedIndex - 1);
    } 
  }

  /**
   * called on click of the indicator, set new selectedIndex and raise onIndicatorClick callback method
   */
  const handleSelectIndicator = (index: number) => {
    if (props.onIndicatorClick) props.onIndicatorClick(index);
    setSelectedIndex(index);
  }

  /**
   * @returns list of indicator JSX
   */
  const getIndicator = () => {
    const indicators = [];
    for (let i: number = 0; i <= lastIndex; i++) {
      const indicatorJSX = (
        <div 
          key={i}
          className={"carousel-indicator " + ((selectedIndex === i) ? 'active' : '')}
          onClick={() => handleSelectIndicator(i)}
        >&#9711;</div>
      );
      indicators.push(indicatorJSX);
    }
    return indicators;
  }

  return (
    <div className="carousel-root">
      <div className="carousel-container" style={{ height: props.height }}>
        <div className="arrow arrow-left">
          <button
            onClick={handlePrevious}
            disabled={selectedIndex === 0}
          >&#8249;</button>
        </div>
        {currentBlocks.map((currentBlock: Data, index: number) => (
          <div 
            key={index}
            className="block" 
            style={{ 
              width: blockWidth + "%",
            }}
          >
            <div className="block-title-container">
              <span className="block-title">{currentBlock.title}</span>
            </div>
            <div className="block-img-container">
              <img 
                className="block-img"
                src={getRandomImage(currentBlock.images)}
                alt={currentBlock.title}
              />
            </div>
          </div>
        ))}
        <div className="arrow arrow-right">
          <button
            onClick={handleNext}
            disabled={selectedIndex === lastIndex}
          >&#8250;</button>
        </div>
      </div>
      {props.showIndicator 
        ? <div className="carousel-indicator-container">{getIndicator()}</div>
        : null
      }
    </div>
  );
}

Carousel.defaultProps = {
  blocks: 4,
  mobileBlocks: 1,
  height: "300px",
  showIndicator: true,
}

export default Carousel;
