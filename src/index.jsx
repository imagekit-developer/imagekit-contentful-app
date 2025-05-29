import { setup } from '@contentful/dam-app-base';
import { useEffect } from 'react';
import { render } from 'react-dom';
import './index.css';
import { pick } from './utils';

const CTA = 'Select or upload an asset';
const DIALOG_TITLE = 'Select or upload an asset from ImageKit Media Library';
const FIELDS_TO_PERSIST = ['id', 'name', 'url'];

setup({
  cta: CTA,
  name: 'ImageKit Media Library',
  logo: 'https://ikmedia.imagekit.io/logo/light-icon_GTyhLlWNX-.svg?tr=f-png:r-100',
  color: '#036FE3',
  description:
    'Select and upload assets from your ImageKit Media Library.',
  makeThumbnail,
  renderDialog,
  openDialog,
  isDisabled: () => false,
});

function DialogLocation({ sdk }) {
  useEffect(() => {
    // Load the ImageKit Media Library Widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/imagekit-media-library-widget/dist/imagekit-media-library-widget.min.js';
    script.async = true;
    script.onload = () => {
      // Initialize the widget after script loads
      initializeWidget();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeWidget = () => {
    const config = {
      container: '#imagekit-container',
      className: 'media-library-widget',
      dimensions: {
        width: '100%',
        height: '99%',
      },
      view: 'inline',
      renderOpenButton: false,
      mlSettings: {
        multiple: false,
        toolbar: {
          showCloseButton: false,
        }
      }
    };

    const callback = (payload) => {
      if (payload.eventType === 'INSERT' && payload.data && payload.data.length > 0) {
        const selectedAsset = payload.data[0];
        sdk.close([{
          id: selectedAsset.fileId,
          name: selectedAsset.name,
          url: selectedAsset.url
        }]);
      }
    };

    // eslint-disable-next-line no-undef
    new IKMediaLibraryWidget(config, callback);
  };

  return (
    <div id="imagekit-container" style={{ width: '100%', height: '600px' }} />
  );
}

function makeThumbnail(attachment) {
  const thumbnail = attachment.url;
  const url = typeof thumbnail === 'string' ? thumbnail : undefined;
  const alt = attachment.name;
  return [url, alt];
}

async function renderDialog(sdk) {
  render(<DialogLocation sdk={sdk} />, document.getElementById('root'));
  sdk.window.startAutoResizer();
}

async function openDialog(sdk, _currentValue, _config) {
  const result = await sdk.dialogs.openCurrentApp({
    position: 'center',
    title: DIALOG_TITLE,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    width: 1400,
    minHeight: 600,
    allowHeightOverflow: true,
  });

  if (!Array.isArray(result)) {
    return [];
  }

  return result.map((asset) => pick(asset, FIELDS_TO_PERSIST));
}
