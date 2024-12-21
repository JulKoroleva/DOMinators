import loadable from '@loadable/component';
/**
 * Disable SSR on a specific loadable component with ssr: false:
 * CirclePickerField использует внутри себя react-slider-color-picker, в котором PNG вызывает падение
 * */
const CirclePickerField = loadable(() => import('./CirclePickerField'), { ssr: false });
export { CirclePickerField };
