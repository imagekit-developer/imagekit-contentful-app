import { Integration } from "@contentful/dam-app-base";
import { MediaLibraryWidgetOptions } from "imagekit-media-library-widget";

export const DEFAULT_INTEGRATION_PARAMETERS: Partial<Integration> = {
  cta: 'Select or upload an asset',
  name: 'ImageKit Media Library',
  logo: 'https://ikmedia.imagekit.io/logo/light-icon_GTyhLlWNX-.svg?tr=f-png:r-100',
  color: '#036FE3',
  description:
    'Select and upload assets from your ImageKit Media Library.',
}

export const DEFAULT_ML_WIDGET_OPTIONS: MediaLibraryWidgetOptions = {
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
} 