<script setup lang="ts">
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { useCustomize } from '~/shared/states/customizeState';

const customize = useCustomize();
const extensions = [javascript(), oneDark];
</script>

<template>
  <div>
    <codemirror
      v-model="customize.controlsMenu.customizationInfosMenu.data.content.javascript"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      auto-destroy
    />
  </div>
</template>

<style>
.cm-editor {
  background-color: #1a1d2e !important;
}

.cm-gutters {
  background-color: #1a1d2e !important;
}

.cm-gutterElement {
  background-color: transparent !important;
}

.cm-tooltip-autocomplete {
  background-color: #131524 !important;
  border-radius: 10px;
  padding: 5px 5px;
}

.cm-tooltip-autocomplete ul li {
  display: flex;
  align-items: center;
  color: #d3d3d3 !important;
  border-radius: 3px;
  padding-left: 20px !important;
  height: 35px !important; 
}

.cm-tooltip-autocomplete ul li[aria-selected] {
  background-color: #1a1d2e !important;
}

.cm-completionIcon {
  display: none !important;
}
</style>