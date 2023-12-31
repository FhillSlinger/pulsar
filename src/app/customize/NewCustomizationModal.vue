<script setup lang="ts">
import InputText from 'primevue/inputtext';
import { Status } from '~/@types/status';
import DocPrototype from '~/shared/components/DocPrototype.vue';
import { useCustomize } from '~/shared/states/customizeState';
import { Documentation } from '~/database/models/Documentation';

const regions: ('top' | 'bottom')[] = ['top', 'bottom'];
const customize = useCustomize();

async function handleSubmit() {
  const newCustomization = {
    id: Math.round(Math.random() * (10000 - 1) + 1),
    content: { html: '', css: '', js: '' },
    ...JSON.parse(JSON.stringify(customize.value.controlsMenu.newCustomizationModal.data))
  };

  const updatedPayload = {
    customizations: [...JSON.parse(JSON.stringify(customize.value.doc.customizations)), newCustomization]
  };
  const result = await Documentation.edit(customize.value.doc.id, updatedPayload);

  if(result === Status.OK) {
    customize.value.doc.customizations = updatedPayload.customizations;
  } else {
    alert('Error on trying to create a new customization');
  }
  customize.value.controlsMenu.newCustomizationModal.isOpen = false;
  customize.value.controlsMenu.newCustomizationModal.data.title = '';
}
</script>

<template>
  <div>
    <!--Modal frame-->
    <div 
      :class="`
        ${!customize.controlsMenu.newCustomizationModal.isOpen && 'opacity-0 pointer-events-none'}
        duration-300
        fixed
        left-2/4
        top-2/4
        -translate-x-2/4
        -translate-y-2/4
        flex
        max-xl:flex-col
        max-xl:overflow-y-auto
        w-full
        xl:w-[800px]
        h-full
        xl:h-[430px]
        bg-secondary
        z-[9999]
        rounded-xl
      `"
    >
      <!--Doc prototype-->
      <div class="flex justify-center items-center w-full xl:min-w-[350px] h-full bg-secondary_darken rounded-l-xl max-xl:py-8">
        <DocPrototype
          :colors="customize.doc.colors"
          :features="customize.doc.features"
          :selected-region="customize.controlsMenu.newCustomizationModal.data.region"
        />
      </div>
      <!--Form-->
      <form @submit.prevent="handleSubmit()" class="w-full p-10">
        <h2 class="text-xl text-primary/90 font-medium">{{ $t('customize.new-customization-modal-title') }}</h2>
        <hr class="w-full h-px bg-divider border-none mt-8 mb-3.5" />
        <div class="flex flex-col">
          <!--Title input-->
          <div class="w-full flex flex-col gap-2 mt-5">
            <label class="text-sm text-primary/40 font-medium">{{ $t('customize.new-customization-modal-title-input-label') }}</label>
            <InputText
              v-model="customize.controlsMenu.newCustomizationModal.data.title"
              class="!h-11 rounded-md contrast-200 !border-secondary/60"
              :placeholder="$t('customize.new-customization-modal-title-input-placeholder')"
              required
            />
          </div>
          <!--Region input-->
          <div class="w-full flex flex-col gap-2 mt-5">
            <label class="text-sm text-primary/40 font-medium">{{ $t('customize.new-customization-modal-region-input-label') }}</label>
            <div class="flex gap-0.5 items-center mt-1.5">
              <Button
                v-for="region in regions"
                @click="customize.controlsMenu.newCustomizationModal.data.region = region"
                :class="`
                  !w-10
                  !h-10 
                  ${customize.controlsMenu.newCustomizationModal.data.region === region && '!bg-primary'} 
                  !rounded-none
                  first:!rounded-l-md 
                  last:!rounded-r-md
                `"
              >
                <font-awesome-icon 
                  icon="fa-solid fa-arrow-left-long" 
                  :class="`
                    ${region === 'top'? 'rotate-90' : ''}
                    ${region === 'bottom'? '-rotate-90' : ''}
                  `"
                ></font-awesome-icon>
              </Button>
            </div>
          </div>
          <!--Cancel and submit buttons-->
          <div class="flex flex-wrap gap-2.5 self-end mt-16">
            <Button 
              @click="customize.controlsMenu.newCustomizationModal.isOpen = false" 
              class="w-36 !h-10 !bg-secondary/10 contrast-200 hover:!bg-secondary/40"
            >
              {{ $t('customize.new-customization-modal-cancel-button-message') }}
            </Button>
            <Button type="submit" class="w-36 !h-10 !bg-primary hover:!bg-primary/50">
              {{ $t('customize.new-customization-modal-create-button-message') }}
            </Button>
          </div>
        </div>
      </form>
    </div>
    <!--Modal backdrop-->
    <div
      @click="customize.controlsMenu.newCustomizationModal.isOpen = false"
      v-if="customize.controlsMenu.newCustomizationModal.isOpen" 
      class="fixed left-0 top-0 w-screen h-screen bg-[#00000040] z-[9998]"
    ></div>
  </div>
</template>