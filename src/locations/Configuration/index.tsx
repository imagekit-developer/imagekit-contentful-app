import { Form, FormControl, GlobalStyles, Heading, Paragraph, TextInput } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import { useSDK } from '@contentful/react-apps-toolkit';
import { ConfigAppSDK } from '@contentful/app-sdk';
import { useCallback, useEffect, useState } from 'react';

interface Parameters {
  apiKey: string;
  urlEndpoint: string;
}

const ConfigScreen = () => {
  const sdk = useSDK<ConfigAppSDK>();
  const [parameters, setParameters] = useState<Parameters>({
    apiKey: '',
    urlEndpoint: '',
  });

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks the "Install" button.
    const currentState = await sdk.app.getCurrentState();

    // Validate the parameters
    // if (!parameters.apiKey || !parameters.urlEndpoint) {
    //   sdk.notifier.error('Please provide both API Key and URL Endpoint.');
    //   return false;
    // }

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // Initialize the app
    sdk.app.onConfigure(() => onConfigure());

    // Get current parameters
    (async () => {
      const currentParameters = await sdk.app.getParameters<Parameters>();
      if (currentParameters) {
        setParameters({
          apiKey: currentParameters.apiKey || '',
          urlEndpoint: currentParameters.urlEndpoint || '',
        });
      }
    })();

    // Signal to Contentful that installation is complete
    sdk.app.setReady();
  }, [sdk, onConfigure]);

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
              onChange={(e) => setParameters(prev => ({ ...prev, apiKey: e.target.value }))}
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
              onChange={(e) => setParameters(prev => ({ ...prev, urlEndpoint: e.target.value }))}
              placeholder="https://ik.imagekit.io/your_imagekit_id"
            />
            <FormControl.HelpText>Your ImageKit URL endpoint (e.g., https://ik.imagekit.io/your_imagekit_id)</FormControl.HelpText>
          </FormControl>
        </Form>
      </div>
    </>
  );
};

export default ConfigScreen;
