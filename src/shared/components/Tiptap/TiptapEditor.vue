<script setup lang="ts">
import { lowlight } from './hljsConfig';
import { useEditor as useTiptapEditor, EditorContent, mergeAttributes } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Link from '@tiptap/extension-link';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Image from '@tiptap/extension-image';
import TaskItem from '@tiptap/extension-task-item';
import GapCursor from '@tiptap/extension-gapcursor';
import TaskList from '@tiptap/extension-task-list';
import Heading from '@tiptap/extension-heading';
import SlashCommandsPopup from './SlashCommandsPopup.vue';
import SelectionBubbleMenu from './SelectionBubbleMenu.vue';
import TableControlsMenu from './TableControlsMenu.vue';
import { IDocumentationColorPalette } from '~/database/models/Documentation';
import { useEditor } from '~/shared/states/editorState';

const emit = defineEmits(['update:modelValue']);
const pageEditor = useEditor();
const props = defineProps<{
  colors: IDocumentationColorPalette,
  content: string | undefined
}>();

const { t } = useI18n();

const editor = useTiptapEditor({
  content: props.content,
  extensions: [
    StarterKit.configure({
      horizontalRule: {
        HTMLAttributes: {
          class: 'pulsar-divider'
        }
      },
      bulletList: {
        keepMarks: true,
        HTMLAttributes: {
          class: 'pulsar-bulletlist'
        }
      },
      paragraph: {
        HTMLAttributes: {
          class: 'pulsar-paragraph'
        }
      },
      hardBreak: {
        keepMarks: true
      },
      orderedList: {
        HTMLAttributes: {
          class: 'pulsar-numberedlist'
        }
      },
      heading: false,
      codeBlock: false
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return `H${node.attrs.level} ${t('markdowneditor.is-empty-message')}`;
        }
        return t('markdowneditor.line-is-empty-placeholder');
      }
    }),
    Markdown.configure({
      html: true,
      linkify: true,
      bulletListMarker: '-',
      tightListClass: 'tight',
      breaks: false,
      tightLists: true,
      transformCopiedText: true,
      transformPastedText: true
    }),
    Link.configure({
      protocols: ['https', 'http'],
      autolink: false,
      linkOnPaste: true,
      HTMLAttributes: {
        class: 'pulsar-link'
      }
    }),
    BubbleMenuExtension,
    Table.configure({ 
      resizable: true,
      lastColumnResizable: true,
      cellMinWidth: 200,
      HTMLAttributes: {
        class: 'pulsar-table'
      }
    }),
    CodeBlockLowlight.configure({
      lowlight,
      exitOnArrowDown: true,
      HTMLAttributes: {
        class: 'highlighted-codeblock'
      }
    }),
    Heading
    .configure({
      levels: [1, 2, 3, 4]
    })
    .extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          class: {
            default: null,
            renderHTML(attributes) {
              return {
                class: attributes.level <= 2? 
                `pulsar-heading pulsar-heading-indexed pulsar-heading-${attributes.level}` : 
                `pulsar-heading pulsar-heading-${attributes.level}` 
              }
            }
          }
        }
      }
    }),
    TableHeader,
    TableCell.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          colwidth: {
            default: null,
            parseHTML: element => {
              const colwidth = element.getAttribute('colwidth');
              const value = colwidth
                ? colwidth.split(',').map(item => parseInt(item, 10))
                : null;
      
              return value;
            },
          },
          style: {
            default: null,
          }
        }
      },
      renderHTML({ HTMLAttributes }) {
        let totalWidth = 0;
        let fixedWidth = true;

        
        if (HTMLAttributes.colwidth) {
          HTMLAttributes.colwidth.forEach((col: number) => {
            if (!col) {
              fixedWidth = false;
            } else {
              totalWidth += col;
            }
          });
        } else {
          fixedWidth = false;
        }
    
        if (fixedWidth && totalWidth > 0) {
          HTMLAttributes.style = `min-width: ${totalWidth}px;`;
        } else if (totalWidth && totalWidth > 0) {
          HTMLAttributes.style = `max-width: ${totalWidth}px;`;
        } else {
          HTMLAttributes.style = null;
        }

        return [
          'td',
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
          0
        ];
      }
    }),
    TableRow,
    Image.configure({
      HTMLAttributes: {
        class: 'pulsar-image'
      }
    }),
    TaskList.configure({
      HTMLAttributes: {
        class: 'pulsar-todolist'
      }
    }),
    TaskItem.configure({
      nested: true
    })
  ],
  parseOptions: {
    preserveWhitespace: 'full'
  },
  onUpdate: () => {
    // Send current editor html content to external components using emit event
    emit('update:modelValue', editor.value?.getHTML(), editor.value);
  }
});

// Set editor content on props.content was changed
watch(() => pageEditor.value.currentSelectedPage, (value) => {
  if(!editor.value) return;
  editor.value?.commands.setContent(value.content, true);
});
</script>

<template>
  <div class="relative">
    <SelectionBubbleMenu
      :editor="editor"
      :colors="props.colors"
    />
    <SlashCommandsPopup
      :editor="editor"
      :colors="props.colors"
    />
    <TableControlsMenu
      :editor="editor"
      :colors="props.colors"
    />
    <!--Editor container-->
    <editor-content
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      class="w-full min-h-[80vh] !overflow-visible" 
      :editor="editor"
    />
    <div
      @click="editor?.chain().focus('end').run()"
      class="w-full h-[20vh] mt-5 cursor-pointer"
    ></div>
  </div>
</template>

<style lang="scss">
// Disable editor outline border on click
.ProseMirror:focus-visible {
  outline: none;
}

.tiptap {
  // Headings
  .pulsar-heading {
    color: v-bind('props.colors.text');
    font-weight: 500;
  }

  .pulsar-heading-1 { font-size: 35px; }

  .pulsar-heading-2 { font-size: 30px; }

  .pulsar-heading-3 { font-size: 25px; }

  .pulsar-heading-4 { font-size: 22px; }

  // Paragraph
  .pulsar-paragraph { color: v-bind('props.colors.text + "b9"'); }

  .pulsar-paragrap:empty::after {
    content: "\00A0";
  }

  // Link
  .pulsar-link { color: v-bind('props.colors.primary'); }

  // Horizontal rule
  .pulsar-divider {
    width: 100%;
    height: 1px;
    border: none;
    background-color: v-bind('colors.divider') !important;
  }

  // BulletList and NumberedList
  .pulsar-bulletlist,
  .pulsar-numberedlist {
    padding: 0 1rem;
    color: v-bind('colors.text');
  }

  .pulsar-bulletlist {
    list-style: disc;
  }

  .pulsar-numberedlist {
    list-style: decimal;
  }

  //Placeholder
  .is-empty::before {
    content: attr(data-placeholder);
    float: left;
    color: v-bind('props.colors.text + "50"');
    pointer-events: none;
    height: 0;
  }

  // Image
  .pulsar-image {
    max-width: 100%;
    height: auto;
    border-radius: 5px;

    &.ProseMirror-selectednode {
      outline: 3px solid v-bind('colors.primary');
    }
  }

  // CodeBlock
  .highlighted-codeblock {
    background-color: v-bind('props.colors.secondary');
    color: v-bind('props.colors.codeBlockText');
    font-weight: 400;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    overflow-x: scroll;
    white-space: pre !important;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 16px;
    }

    .hljs-comment, .hljs-quote { color: v-bind('props.colors.codeBlockComments'); }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: v-bind('props.colors.codeBlockVariable');
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: v-bind('props.colors.codeBlockLiteral');
    }

    .hljs-string, .hljs-symbol, .hljs-bullet { color: v-bind('props.colors.codeBlockString'); }

    .hljs-title, .hljs-section { color: v-bind('props.colors.codeBlockSection'); }

    .hljs-keyword, .hljs-selector-tag { color: v-bind('props.colors.codeBlockKeyword'); }

    .hljs-emphasis { font-style: italic;}

    .hljs-strong { font-weight: 700; }
  }

  // Tables
  table {
    border-collapse: collapse;
    table-layout: fixed;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid v-bind('colors.secondary');
      padding: 6px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * { margin-bottom: 0; }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: v-bind('colors.secondary');
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: v-bind('colors.primary');
      pointer-events: none;
    }

    p { margin: 0; }
  }
}

.tableWrapper {
  padding: 1rem 0;
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>