import { Button } from '@contentful/f36-components';
import { AssetIcon } from '@contentful/f36-icons';
import tokens from '@contentful/f36-tokens';
import { useSDK } from '@contentful/react-apps-toolkit';
import { useCallback } from 'react';
import { ImageKitAsset } from '../../types/ImageKitAsset';
import { DEFAULT_INTEGRATION_PARAMETERS, DIALOG_TITLE } from '../../constants';

interface Props {
  onNewAssetsAdded: (assets: ImageKitAsset[]) => void;
  isDisabled: boolean;
}

export function OpenDialogButton({ onNewAssetsAdded, isDisabled }: Props) {
  const sdk = useSDK();
  const handleDialogOpenClick = useCallback(async () => {
    const result = await sdk.dialogs.openCurrentApp({
      position: 'center',
      title: DIALOG_TITLE,
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      width: 1400,
    });

    if (!result) {
      return;
    }

    console.log('result', result);

    onNewAssetsAdded(result);
  }, [onNewAssetsAdded, sdk.dialogs]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
    }}>
      <img src={DEFAULT_INTEGRATION_PARAMETERS.logo} alt="Logo"
        style={{
          display: 'block',
          width: '30px',
          height: '30px',
          marginRight: tokens.spacingM,
      }} />
      
      <Button startIcon={<AssetIcon />} variant="secondary" size="small" onClick={handleDialogOpenClick} isDisabled={isDisabled}>
        {DEFAULT_INTEGRATION_PARAMETERS.cta}
      </Button>
    </div>
  );
}
