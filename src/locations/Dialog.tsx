import { DialogAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { injectGlobal } from '@emotion/css';
import { useEffect } from 'react';
import { ImagekitMediaLibraryWidget, MediaLibraryWidgetOptions } from 'imagekit-media-library-widget';
import { DEFAULT_ML_WIDGET_OPTIONS } from '../constants';
import { ImageKitAsset } from '../types/ImageKitAsset';

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>();

  useEffect(() => {
    // style `body`
    injectGlobal({
      'html, body, #root': {
        padding: 0,
        margin: 0,
        border: 0,
        height: '100%',
        overflow: 'hidden',
      },
    });

    const config: MediaLibraryWidgetOptions = DEFAULT_ML_WIDGET_OPTIONS;
    const callback = (payload: { eventType: string, data: ImageKitAsset[] }) => {
      if (payload.eventType === 'INSERT' && payload.data && payload.data.length > 0) {
        sdk.close([payload.data[0]]);
      }
    };

    const widget = new ImagekitMediaLibraryWidget(config, callback);
    widget.open();

    sdk.window.updateHeight(window.outerHeight);

    return () => {
      // Cleanup if needed
    };
  }, [sdk]);

  return <div id="imagekit-container" style={{ width: '100%', height: '100%' }} />;
};

export default Dialog;
