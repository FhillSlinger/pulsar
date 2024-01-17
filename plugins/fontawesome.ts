import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import * as RegularIcons from '@fortawesome/free-regular-svg-icons';
import * as BrandsIcons from '@fortawesome/free-brands-svg-icons';

config.autoAddCss = false;
library.add(...[
  SolidIcons.faMagnifyingGlass,
  SolidIcons.faPlus,
  SolidIcons.faFilter,
  SolidIcons.faClose,
  SolidIcons.faEllipsis,
  SolidIcons.faPenToSquare,
  SolidIcons.faTrash,
  SolidIcons.faFloppyDisk,
  SolidIcons.faCircleNotch,
  SolidIcons.faArrowLeftLong,
  SolidIcons.faEye,
  SolidIcons.faBars,
  SolidIcons.faMap,
  SolidIcons.faBold,
  SolidIcons.faItalic,
  SolidIcons.faStrikethrough,
  SolidIcons.faLink,
  SolidIcons.faT,
  SolidIcons.faEllipsisVertical,
  SolidIcons.faCode,
  SolidIcons.faXmark,
  SolidIcons.faTable,
  SolidIcons.faImage,
  SolidIcons.faMinus,
  SolidIcons.faList,
  SolidIcons.faListOl,
  SolidIcons.faHeading,
  SolidIcons.faLinesLeaning,
  SolidIcons.faDownload,
  SolidIcons.faUpload,
  SolidIcons.faInfo,
  SolidIcons.faCheck,
  SolidIcons.faTerminal,
  SolidIcons.faKeyboard,
  SolidIcons.faHeading,
  SolidIcons.faCloudArrowUp,
  SolidIcons.faRotate,
  SolidIcons.faPalette,
  SolidIcons.faMicrochip,
  SolidIcons.faCode,
  SolidIcons.faStar,
  SolidIcons.faWindowMaximize,
  SolidIcons.faFileArrowDown,
  SolidIcons.faRightFromBracket,
  SolidIcons.faChevronDown,
  SolidIcons.faChevronUp,
  SolidIcons.faShareFromSquare,
  SolidIcons.faTableColumns,
  RegularIcons.faCircleQuestion,
  BrandsIcons.faDiscord,
  BrandsIcons.faGoogle,
  BrandsIcons.faCss3,
  BrandsIcons.faSquareJs,
  BrandsIcons.faMarkdown,
  BrandsIcons.faPix,
  BrandsIcons.faGithub
]);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});