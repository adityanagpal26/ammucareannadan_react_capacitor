import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

const ImageGallery = ({ images, className = '' }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  if (!images.length) return null;
  
  return (
    <>
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${className}`}>
        {images.slice(0, 6).map((image, index) => (
          <div
            key={index}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90"
            onClick={() => openModal(index)}
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {images.length > 6 && (
          <div
            className="aspect-square rounded-lg overflow-hidden cursor-pointer relative hover:opacity-90"
            onClick={() => openModal(6)}
          >
            <img
              src={images[6]}
              alt={`Gallery image 7`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium text-lg">+{images.length - 6}</span>
            </div>
          </div>
        )}
      </div>
      
      {showModal && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <motion.div
            className="relative w-full max-w-3xl mx-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white z-10"
              onClick={closeModal}
            >
              <X size={24} />
            </button>
            
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={`Gallery image full view`}
                className="w-full rounded-lg"
              />
              
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white"
                onClick={handlePrevImage}
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white"
                onClick={handleNextImage}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="mt-4 text-center text-white">
              {currentImageIndex + 1} / {images.length}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;