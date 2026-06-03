export const debounce = (
    callback: () => void,
    delay: number,
) => {
    const timer = setTimeout(callback, delay);

    return () => clearTimeout(timer);
};