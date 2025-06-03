import { Form, FormControl, GlobalStyles, Heading, Paragraph, TextInput, Checkbox, Select } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import { useSDK } from '@contentful/react-apps-toolkit';
import { ConfigAppSDK } from '@contentful/app-sdk';
import { useCallback, useEffect, useState } from 'react';

interface Parameters {
  installationUuid: string;
  apiKey: string;
  urlEndpoint: string;
  publicKey: string;
  folderPath: string;
  collectionId: string;
  fileType: string;
  searchQuery: string;
  allowMultipleSelections: boolean;
  maxFileSelections: number | null;
  defaultTransformation: string;
  allowUploads: boolean;
  mediaQuality: string;
}

const DEFAULT_PARAMETERS: Parameters = {
  installationUuid: '',
  apiKey: '',
  urlEndpoint: '',
  publicKey: '',
  folderPath: '',
  collectionId: '',
  fileType: '',
  searchQuery: '',
  allowMultipleSelections: true,
  maxFileSelections: null,
  defaultTransformation: '',
  allowUploads: true,
  mediaQuality: 'auto'
};

const ConfigScreen = () => {
  const sdk = useSDK<ConfigAppSDK>();
  const [parameters, setParameters] = useState<Parameters>(DEFAULT_PARAMETERS);

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();
    return {
      parameters: {
        ...parameters,
        installationUuid: parameters.installationUuid || window.crypto.randomUUID(),
      },
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());

    (async () => {
      const currentParameters = await sdk.app.getParameters<Parameters>();
      if (currentParameters) {
        setParameters({
          ...DEFAULT_PARAMETERS,
          ...currentParameters,
        });
      }
    })();

    sdk.app.setReady();
  }, [sdk, onConfigure]);

  const mediaQualityOptions = [
    { label: 'Auto', value: 'auto' },
    { label: 'Original', value: 'original' },
    ...Array.from({ length: 10 }, (_, i) => ({
      label: `${(i + 1) * 10}`,
      value: `${(i + 1) * 10}`,
    })),
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, value: string | boolean | number | null) => {
    const key: keyof Parameters = event.target.name as keyof Parameters;
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <>
      <GlobalStyles />
      <div style={{
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        top: 0,
        width: '100%',
        height: '300px',
        backgroundColor: '#f4b21b',
      }} />
      <div style={{
        height: 'auto',
        minHeight: '65vh',
        margin: '0 auto',
        marginTop: tokens.spacingXl,
        padding: `${tokens.spacingXl} ${tokens.spacing2Xl}`,
        maxWidth: tokens.contentWidthText,
        backgroundColor: tokens.colorWhite,
        zIndex: 2,
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '2px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <img 
            src="https://ik.imgkit.net/ikmedia/logo/light_T4buIzohVH.svg" 
            alt="ImageKit logo full"
            style={{
              display: 'block',
              width: '175px',
              margin: `${tokens.spacingXl} 0`,
            }} 
          />
        </div>
        <Heading>About ImageKit</Heading>
        <Paragraph>
          The ImageKit app allows editors to select media from their ImageKit Media Library. Select the asset from ImageKit that you want your entry to reference.
        </Paragraph>
        <hr style={{
          marginTop: tokens.spacingL,
          marginBottom: tokens.spacingL,
          border: 0,
          height: '1px',
          backgroundColor: tokens.gray300,
        }} />
        
        <Heading as="h2" marginTop="spacingL">Configuration</Heading>
        <Paragraph>
          To set up the ImageKit integration, please provide your ImageKit credentials below:
        </Paragraph>

        <Form style={{ marginTop: tokens.spacingL }}>
          <FormControl isRequired>
            <FormControl.Label>API Key</FormControl.Label>
            <TextInput
              name="apiKey"
              id="apiKey"
              value={parameters.apiKey}
              onChange={(e) => handleInputChange(e, e.target.value)}
              placeholder="Enter your ImageKit API Key"
              type="password"
            />
            <FormControl.HelpText>You can find this in your ImageKit dashboard under Developer Options</FormControl.HelpText>
          </FormControl>

          <FormControl isRequired marginTop="spacingM">
            <FormControl.Label>URL Endpoint</FormControl.Label>
            <TextInput
              name="urlEndpoint"
              id="urlEndpoint"
              value={parameters.urlEndpoint}
              onChange={(e) => handleInputChange(e, e.target.value)}
              placeholder="https://ik.imagekit.io/your_imagekit_id"
            />
            <FormControl.HelpText>Your ImageKit URL endpoint (e.g., https://ik.imagekit.io/your_imagekit_id)</FormControl.HelpText>
          </FormControl>

          <FormControl isRequired marginTop="spacingM">
            <FormControl.Label>Public Key</FormControl.Label>
            <TextInput
              name="publicKey"
              id="publicKey"
              value={parameters.publicKey}
              onChange={(e) => handleInputChange(e, e.target.value)}
              placeholder="Enter your ImageKit Public Key"
            />
            <FormControl.HelpText>Your ImageKit Public Key for SDK initialization</FormControl.HelpText>
          </FormControl>

          <FormControl marginTop="spacingM">
            <FormControl.Label>Folder Path</FormControl.Label>
            <TextInput
              name="folderPath"
              id="folderPath"
              value={parameters.folderPath}
              onChange={(e) => handleInputChange(e, e.target.value)}
              placeholder="/path/to/folder"
            />
            <FormControl.HelpText>Default folder to open in Media Library Widget</FormControl.HelpText>
          </FormControl>

          <FormControl marginTop="spacingM">
            <FormControl.Label>Collection ID</FormControl.Label>
            <TextInput
              name="collectionId"
              id="collectionId"
              value={parameters.collectionId}
              onChange={(e) => handleInputChange(e, e.target.value)}
              placeholder="Enter Collection ID"
            />
            <FormControl.HelpText>Specific collection to open in the widget</FormControl.HelpText>
          </FormControl>

          <FormControl marginTop="spacingM">
            <FormControl.Label>File Type Filter</FormControl.Label>
            <TextInput
              name="fileType"
              id="fileType"
              value={parameters.fileType}
              onChange={(e) => handleInputChange(e, e.target.value)}
              placeholder="e.g., image, video"
            />
            <FormControl.HelpText>Filter to show specific types of files (comma-separated)</FormControl.HelpText>
          </FormControl>

          <FormControl marginTop="spacingM">
            <FormControl.Label>Search Query</FormControl.Label>
            <TextInput
              name="searchQuery"
              id="searchQuery"
              value={parameters.searchQuery}
              onChange={(e) => handleInputChange(e, e.target.value)}
              placeholder="Default search query"
            />
            <FormControl.HelpText>Default search query when opening the widget</FormControl.HelpText>
          </FormControl>

          <FormControl marginTop="spacingM">
            <Checkbox
              name="allowMultipleSelections"
              id="allowMultipleSelections"
              isChecked={parameters.allowMultipleSelections}
              onChange={(e) => handleInputChange(e, e.target.checked)}
            >
              Allow Multiple Selections
            </Checkbox>
          </FormControl>

          <FormControl marginTop="spacingM">
            <FormControl.Label>Maximum Files Selection</FormControl.Label>
            <TextInput
              name="maxFileSelections"
              id="maxFileSelections"
              type="number"
              value={parameters.maxFileSelections?.toString() || ''}
              onChange={(e) => handleInputChange(e, e.target.value ? parseInt(e.target.value) : null)}
              min="1"
            />
            <FormControl.HelpText>Maximum number of files that can be selected</FormControl.HelpText>
          </FormControl>

          <FormControl marginTop="spacingM">
            <FormControl.Label>Default Transformation</FormControl.Label>
            <TextInput
              name="defaultTransformation"
              id="defaultTransformation"
              value={parameters.defaultTransformation}
              onChange={(e) => handleInputChange(e, e.target.value)}
              placeholder="tr:w-200,h-200 or transformation-name"
            />
            <FormControl.HelpText>Default transformation to apply to selected assets</FormControl.HelpText>
          </FormControl>

          <FormControl marginTop="spacingM">
            <Checkbox
              name="allowUploads"
              id="allowUploads"
              isChecked={parameters.allowUploads}
              onChange={(e) => handleInputChange(e, e.target.checked)}
            >
              Allow Uploads
            </Checkbox>
          </FormControl>

          <FormControl marginTop="spacingM">
            <FormControl.Label>Media Quality</FormControl.Label>
            <Select
              name="mediaQuality"
              id="mediaQuality"
              value={parameters.mediaQuality}
              onChange={(e) => handleInputChange(e, e.target.value)}
            >
              {mediaQualityOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
            <FormControl.HelpText>Quality setting for all media assets</FormControl.HelpText>
          </FormControl>
        </Form>
      </div>
    </>
  );
};

export default ConfigScreen;
