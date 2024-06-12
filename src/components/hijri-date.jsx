const gregorianToHijri = (gregorianDate) => {
    const g = gregorianDate.getFullYear();
    const m = gregorianDate.getMonth() + 1;
    const d = gregorianDate.getDate();
  
    let h = Math.floor((g - 622) / 33) * 32;
  
    const remainder = (g - 622) % 33;
  
    if (remainder === 0) h -= 1;
    else h += remainder;
  
    const mi = Math.floor((m - 1) / 7) * 30 + ((m - 1) % 7) * 4 + Math.floor(((m - 1) % 7) / 2);
    const hijriDay = h + mi + d - 1;
  
    return hijriDay;
  };
  
  // Example usage:
  const gregorianDate = new Date(2024, 4, 24); // May 24, 2024
  const hijriDate = gregorianToHijri(gregorianDate);
  console.log("Hijri Date:", hijriDate);
  