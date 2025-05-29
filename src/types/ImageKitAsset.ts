export interface CmFormValues {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | Array<string | number | boolean>
    | any
}

export interface EmbeddedMetadataValues {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | Array<string | number | boolean | Date>
}

export interface AITagItem {
  name: string
  confidence: number
  source: 'google-auto-tagging' | 'aws-auto-tagging'
}

export interface ExtensionStatus {
  [key: string]: 'success' | 'pending' | 'failed'
}

export interface FileVersionInfo {
  id: string
  name: string
}

export interface CreatedBy {
  userId: string
  name: string
  email: string
}

export interface ImageKitAsset {
  AITags: AITagItem[] | null
  createdAt: string
  customCoordinates: string | null
  customMetadata: any
  embeddedMetadata: EmbeddedMetadataValues
  fileId: string
  filePath: string
  fileType: string
  hasAlpha: boolean
  height: number
  isPrivateFile: boolean
  isPublished: boolean
  mime?: string
  name: string
  size: number
  tags: string[] | null
  thumbnail: string
  type: string
  updatedAt: string
  url: string
  width: number
  extensionStatus?: ExtensionStatus
  versionInfo: FileVersionInfo
  createdBy?: CreatedBy
  permission?: any
  previewUrl?: string
}
