export const gerarCorAleatoriaHex = () => {
  const red = Math.floor(Math.random() * 256).toString(16);
  const green = Math.floor(Math.random() * 256).toString(16);
  const blue = Math.floor(Math.random() * 256).toString(16);

  const corHex = `#${red.padStart(2, '0')}${green.padStart(
    2,
    '0',
  )}${blue.padStart(2, '0')}`;

  return corHex;
};
