<script setup lang="ts">
import InputText from 'primevue/inputtext';

const props = defineProps<{
  data?: object,
  color: string 
}>();
const emit = defineEmits(['update:submit']);

const value = ref('');
const isOpen = ref(false);
const isLoading = ref(false);

function handleSubmit() {
  isOpen.value = false;
  isLoading.value = true;
  // @ts-ignore
  emit('update:submit', value.value, props.data? props.data.categoryId : undefined);
  isLoading.value = false;
  value.value = '';
}
</script>

<template>
  <div>
    <!--Open Button-->
    <Button 
      @click="isOpen = true"
      v-if="!isOpen && !isLoading"
      class="gap-2.5 !bg-[#404040]/40 !text-[15px] hover:!bg-[#404040]/20 !px-2.5 !py-1 border-none"
      :style="{ color: color + '90' }"
    >
      <slot />
    </Button>
    <!--Loading-->
    <div v-else-if="isLoading && !isOpen" class="w-28 flex justify-center">
      <font-awesome-icon 
        icon="fa-solid fa-circle-notch" 
        :style="{ color }"
        spin
      ></font-awesome-icon>
    </div>
    <!--Input-->
    <InputText
      v-else
      v-model="value"
      @blur="handleSubmit()"
      @keyup="(ev) => ev.key === 'Enter'? handleSubmit() : false"
      v-focus
      :style="{ color }"
    />
  </div>
</template>