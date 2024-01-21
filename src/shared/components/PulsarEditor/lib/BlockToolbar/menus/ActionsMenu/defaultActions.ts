import { EditorInstance } from '~/shared/components/PulsarEditor/@types/Editor';
import { PluginMenuAction } from '~/shared/components/PulsarEditor/@types/Plugin';

export function defaultActions(edtr: EditorInstance): PluginMenuAction[] {
  return [
    {
      name: edtr.messages.actionsmenu_action_moveup,
      icon: 'fa-solid fa-chevron-up',
      run(editor, block) {
        editor.commands.moveBlockUp(editor.view.currentSelectedBlock || '');
      }
    },
    {
      name: edtr.messages.actionsmenu_action_delete,
      icon: 'fa-solid fa-xmark',
      run(editor, block) {
        editor.commands.deleteBlock(editor.view.currentSelectedBlock || '');
      }
    },
    {
      name: edtr.messages.actionsmenu_action_movedown,
      icon: 'fa-solid fa-chevron-down',
      run(editor, block) {
        editor.commands.moveBlockDown(editor.view.currentSelectedBlock || '');
      }
    }
  ]
};