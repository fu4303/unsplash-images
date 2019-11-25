import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css'
import InfiniteScroll from 'react-infinite-scroll-component';

import GlobalStyle from './Global';
import Container from './Container';
import Header from './Header';
import Image from './Image';
import Modal from './Modal';

type ImageType = {
  id: string,
  alt_description: string,
  urls: {
    small: string,
    regular: string
  }
}

const App: React.FC = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [modalImg, setModalImg] = useState<string>('');
  const [modal, setModal] = useState<boolean>(false);

  const getImages = async (items = 10, page = 1) => {
    const response = await fetch(`https://api.unsplash.com/search/photos?per_page=${items}&page=${page}&query=minimal&client_id=${process.env.REACT_APP_KEY}`);
    const json = await response.json();
    const res = json.results;
    const newImages = [...images, ...res];

    setImages(newImages);
  }

  useEffect(() => {
    getImages();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header />

        <InfiniteScroll
          dataLength={images.length}
          next={() => {
            getImages(10, page + 1);
            setPage(page + 1);
          }}
          hasMore
          loader={<span>Loading</span>}>
          <Masonry
            breakpointCols={{
              default: 3,
              768: 2,
            }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">
            {
              images.map((image: ImageType) => {
                return (
                  <Image
                    key={image.id}
                    src={image.urls.small}
                    alt={image.alt_description}
                    onClick={() => {
                      setModalImg(image.urls.regular);
                      setModal(true);
                    }} />
                )
              })
            }
          </Masonry>
        </InfiniteScroll>
      </Container>

      <Modal
        src={modalImg}
        active={modal} />
    </>
  );
}

export default App;
