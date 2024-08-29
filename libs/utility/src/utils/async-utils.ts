export const AsyncUtils = {
  /**
   * Erzeugt ein {@link Promise}, das nach der gegebenen Zeitspanne erfüllt wird.
   * Kann genutzt werden, um zu warten und ist speziell für asynchrone Funktionen
   * gedacht: `await delay(100);`.
   *
   * @param time Die Zeitverzögerung, entweder als Zeitspanne oder als Zahl, die die zu wartenden Millisekunden darstellt.
   * @returns Ein {@link Promise}, das nach der gegebenen zeit erfüllt wird.
   */
  delay(time: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, Number(time));
    });
  },
};
