<script setup lang="ts">
import { useDocumentations } from '~/shared/states/documentationsState';
import { Documentation } from '~/database/models/Documentation';

const docs = useDocumentations();
const uploadInput = ref<HTMLInputElement>();

async function upload(file: File) {
  if(file?.name && file.name.endsWith('.json')) {
    const fileStringifiedData = await file.text();
    const fileDataParsed = JSON.parse(fileStringifiedData);

    if(fileDataParsed.data && fileDataParsed.data.id) {
      const docExists = (await Documentation.get(fileDataParsed.data.id))? true : false;

      if(docExists) {
        alert(`Already exists a documentation using the id: ${fileDataParsed.data.id}`);
        docs.value.uploadDocsModal.isOpen = false;
      } else {
        await Documentation.create(fileDataParsed.data);
        docs.value.data = [...JSON.parse(JSON.stringify(docs.value.data)), fileDataParsed.data];
        docs.value.uploadDocsModal.isOpen = false;
      }
    } else {
      docs.value.uploadDocsModal.isOpen = false;
      alert('Invalid manifest.json "data" property is missing!');
    }
  }
}

function handleDragStart() {
  docs.value.uploadDocsModal.highlighted = true;
}

function handleDragEnd() {
  docs.value.uploadDocsModal.highlighted = false;
}

function handleDragging() {
  docs.value.uploadDocsModal.highlighted = true;
}

async function handleDrop(e: DragEvent) {
  docs.value.uploadDocsModal.highlighted = false;
  const file = e.dataTransfer?.files[0];
  
  if(file) {
    docs.value.uploadDocsModal.isLoading = true;
    await upload(file);
    docs.value.uploadDocsModal.isLoading = false;
  }
}

async function handleUpload(e: HTMLInputElement) {
  const file = e.files![0];

  if(file) {
    docs.value.uploadDocsModal.isLoading = true;
    await upload(file);
    docs.value.uploadDocsModal.isLoading = false;
  }
}
</script>

<template>
  <div>
    <!--Frame-->
    <div 
      :class="`
        ${docs.uploadDocsModal.isOpen? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        fixed
        overflow-y-auto
        left-2/4
        top-2/4
        -translate-x-2/4
        -translate-y-2/4
        w-[650px]
        h-[500px]
        max-lg:w-full
        max-lg:h-full
        bg-secondary
        rounded-lg
        z-[301]
        p-10
        duration-300
      `"
    >
      <!--Modal Header-->
      <div class="flex items-center h-10 justify-between">
        <h2 class="text-[21px] text-primary/90 font-medium">{{ $t('documentations.upload-documentation-modal-title') }}</h2>
        <button @click="docs.uploadDocsModal.isOpen = false">
          <font-awesome-icon icon="fa-solid fa-close" class="text-[23px] text-primary/80"></font-awesome-icon>
        </button>
      </div>
      <!--Upload Step-->
      <div class="h-[calc(100%-80px)]" v-if="!docs.uploadDocsModal.isLoading">
        <div 
          @click="uploadInput?.click()"
          @dragenter.prevent="handleDragStart"
          @dragleave.prevent="handleDragEnd"
          @dragover.prevent="handleDragging"
          @drop.prevent="handleDrop"
          :class="`
            w-full 
            h-[270px]
            max-lg:h-[200px] 
            border-2
            duration-300 
            ${docs.uploadDocsModal.highlighted? 'border-primary' : 'border-primary/30'} 
            rounded-lg
            mt-7 
            cursor-pointer
          `"
        >
          <div class="flex flex-col justify-center items-center h-full">
            <font-awesome-icon 
              icon="fa-solid fa-cloud-arrow-up" 
              :class="`text-[80px] duration-300 ${docs.uploadDocsModal.highlighted? 'text-secondary' : 'text-secondary/20'}`"
            ></font-awesome-icon>
            <p 
              :class="`text-[17px] mt-3.5 duration-300 ${docs.uploadDocsModal.highlighted? 'text-secondary' : 'text-secondary/30'}`"
            >
              {{ $t('documentations.upload-documentation-modal-drag-and-drop-message') }}
            </p>
          </div>
        </div>
        <div class="w-full flex justify-center mt-10">
          <Button @click="uploadInput?.click()" class="w-[230px] !h-11 !bg-primary border-none">
            {{ $t('documentations.upload-documentation-modal-choose-from-computer-button') }}
          </Button>
        </div>
        <input 
          @change="handleUpload($event.currentTarget as HTMLInputElement)"
          ref="uploadInput" 
          class="hidden" 
          type="file"
          accept="application/json"
        />
      </div>
      <!--Loading Step-->
      <div class="flex flex-col gap-3.5 items-center justify-center h-[calc(100%-40px)]" v-else>
        <font-awesome-icon icon="fa-solid fa-circle-notch" class="text-[50px] text-secondary" spin></font-awesome-icon>
        <h3 class="text-center w-[300px] text-primary/80">{{ $t('documentations.upload-documentation-modal-loading-message') }}</h3>
      </div>
    </div>
    <!--Modal Backdrop-->
    <div 
      @click="docs.uploadDocsModal.isOpen = false"
      :class="`
        ${docs.uploadDocsModal.isOpen? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} 
        fixed 
        left-0 
        top-0 
        w-screen 
        h-screen 
        bg-[#00000050]
        duration-300
        z-[300]
      `"
    ></div>
  </div>
</template>