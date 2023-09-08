function generateRandom16DigitNumber() {
    let random16DigitNumber = '';
    for (let i = 0; i < 16; i++) {
      const digit = Math.floor(Math.random() * 10);
      random16DigitNumber += digit.toString();
    }
    const formattedNumber = random16DigitNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
  return 'T-' + formattedNumber;
  }

  module.exports = generateRandom16DigitNumber;