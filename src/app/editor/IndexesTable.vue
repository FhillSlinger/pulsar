<script setup lang="ts">
import { useEditor } from '~/shared/states/editorState';

const editor = useEditor();
const headings = ref<HTMLHeadingElement[]>([]);

function updateHeadings() {
  const newHeadings = document.querySelectorAll<HTMLHeadingElement>('.pulsar-heading-indexed');
  const filteredHeadings = Array.from(newHeadings).filter(heading => heading.textContent);
  headings.value = filteredHeadings;
}

// Monitor new headings in page and change the state to the new headings
watch([() => editor.value.doc.pages, () => editor.value.currentSelectedPage, () => editor.value.doc.features.indexesTable], () => {
  // Timeout to await for the headings to load in the document 
  setTimeout(() => {
    updateHeadings();
  }, 100);
});
</script>

<template>
  <div class="max-lg:hidden max-2xl:ml-[70px] min-w-[180px] max-2xl:w-[250px]" v-if="headings.length >= 1 && editor.doc.features.indexesTable">
    <h2
      class="font-medium text-[15px] truncate"
      :style="{ color: editor.doc.colors.text + 'e9' }"
    >
      {{ editor.doc.indexesTableTitle }}
    </h2>
    <ul class="flex flex-col gap-2.5 mt-2.5">
      <li v-for="heading in headings">
        <button @click="heading.scrollIntoView()" class="max-w-[180px] text-[15px] truncate" :style="{ color: editor.doc.colors.text + 'a1' }">
          {{ heading.textContent }}
        </button>
      </li>
    </ul>
  </div>
</template> 