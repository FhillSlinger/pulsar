import { PluginInstance, PluginOptions } from '../@types/Plugin';
import { NodeView } from './NodeView';

export class Plugin {
  static create(options: PluginOptions): PluginInstance {
    return {
      name: options.name,
      view: {
        schema: (editor, op) => options.addView(editor, op),
        node: (editor, op) => NodeView(options.addView(editor, op))
      },
      shortcuts: options.addShortcuts?.(),
      onRender: options.addOnRender,
      onSelected: options.addOnSelected,
      onUnselected: options.addOnUnselected
    }
  }
}