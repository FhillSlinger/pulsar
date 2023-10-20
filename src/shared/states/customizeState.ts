import { IDocumentation, IDocumentationCustomization, documentationDataEmptyObj } from "~/database/models/Documentation";

type EditorStateType = {
  doc: IDocumentation,
  codeEditor: {
    isOpen: boolean
  }
  controlsMenu: {
    isOpen: boolean,
    isSaved: boolean,
    isSaving: boolean,
    newCustomizationModal: {
      isOpen: boolean,
      data: {
        title: string,
        region: 'left' | 'right' | 'top' | 'bottom'
      }
    },
    customizationInfosMenu: {
      isOpen: boolean,
      data: IDocumentationCustomization
    }
  }
};

export const useCustomize = () => useState<EditorStateType>('customizeState', () => ({
  doc: documentationDataEmptyObj,
  codeEditor: {
    isOpen: false
  },
  controlsMenu: {
    isOpen: false,
    isSaved: true,
    isSaving: false,
    newCustomizationModal: {
      isOpen: false,
      data: {
        title: '',
        region: 'top'
      }
    },
    customizationInfosMenu: {
      isOpen: false,
      data: {
        id: -1,
        title: '',
        region: 'top',
        content: {
          html: '',
          css: '',
          javascript: ''
        }
      }
    }
  }
}));