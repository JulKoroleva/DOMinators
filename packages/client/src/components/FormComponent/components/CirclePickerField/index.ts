import loadable from '@loadable/component';
/**
 * Disable SSR on a specific loadable component with ssr: false:
 * CirclePickerField использует внутри себя react-slider-color-picker, в котором PNG вызывает падение
 * */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CirclePickerField = loadable<any>(() => import('./CirclePickerField'), { ssr: false });
export { CirclePickerField };
