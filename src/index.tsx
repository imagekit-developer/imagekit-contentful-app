import { Integration, setup } from '@contentful/dam-app-base';
import { ImagekitMediaLibraryWidget, MediaLibraryWidgetOptions } from 'imagekit-media-library-widget';
import { useEffect } from 'react';
import { render } from 'react-dom';
import { DEFAULT_INTEGRATION_PARAMETERS, DEFAULT_ML_WIDGET_OPTIONS } from './constants';
import { DialogAppSDK, FieldExtensionSDK } from '@contentful/app-sdk';
import { Asset } from '@contentful/dam-app-base';
import { FileDetailsResponse } from './types/ImageKitAsset';

const DIALOG_TITLE = 'Select or upload an asset from ImageKit Media Library';

setup({
  ...DEFAULT_INTEGRATION_PARAMETERS as Integration,
  parameterDefinitions: [],
  validateParameters: () => null,
  makeThumbnail: (asset: Asset) => {
    const thumbnail = asset.url;
    const url = typeof thumbnail === 'string' ? thumbnail : undefined;
    const alt = asset.name;
    return [url || '', alt || ''];
  },
  renderDialog,
  openDialog,
  isDisabled: () => false,
});

function DialogLocation({ sdk }: { sdk: DialogAppSDK }) {
  useEffect(() => {
    const config: MediaLibraryWidgetOptions = DEFAULT_ML_WIDGET_OPTIONS;

    const callback = (payload: { eventType: string, data: FileDetailsResponse[] }) => {
      if (payload.eventType === 'INSERT' && payload.data && payload.data.length > 0) {
        const selectedAsset: Asset = payload.data[0];
        sdk.close([selectedAsset]);
      }
    };

    const widget = new ImagekitMediaLibraryWidget(config, callback);
    widget.open();

    return () => {
      // Cleanup if needed
    };
  }, [sdk]);

  return (
    <div id="imagekit-container" style={{ width: '100%', height: '600px' }} />
  );
}

async function renderDialog(sdk: DialogAppSDK) {
  render(<DialogLocation sdk={sdk} />, document.getElementById('root'));
  sdk.window.startAutoResizer();
}

async function openDialog(sdk: FieldExtensionSDK, _currentValue: Asset | null, _config: any): Promise<Asset[]> {
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

  return result.map((asset: Asset) => ({ ...asset }));
}
