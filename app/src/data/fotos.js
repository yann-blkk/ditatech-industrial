// Fotos reais dos produtos, com licença livre (Creative Commons).
// As imagens ficam em assets/produtos/. Os créditos aparecem no detalhe do produto
// e na tela "Créditos das imagens", como as licenças exigem.
// Produtos novos cadastrados pelo administrador (no site) usam um ícone no lugar da foto.

// O React Native precisa de require() fixo para cada imagem.
const ARQUIVOS = {
  1: require('../../assets/produtos/sensor-indutivo.jpg'),
  2: require('../../assets/produtos/sensor-fotoeletrico.jpg'),
  3: require('../../assets/produtos/clp-compacto.jpg'),
  4: require('../../assets/produtos/clp-modular.jpg'),
  5: require('../../assets/produtos/robo-colaborativo.jpg'),
  6: require('../../assets/produtos/robo-industrial.jpg'),
  7: require('../../assets/produtos/inversor.jpg'),
  8: require('../../assets/produtos/servomotor.jpg'),
  9: require('../../assets/produtos/ihm.jpg'),
  10: require('../../assets/produtos/cilindro.jpg'),
}

export const FOTOS = {
  1: { arquivo: "sensor-indutivo.jpg", autor: "Lucasbosch", licenca: "CC BY-SA 3.0", licencaUrl: "https://creativecommons.org/licenses/by-sa/3.0", fonte: "https://commons.wikimedia.org/wiki/File:Pepperl%2BFuchs_inductive_proximity_switch_3RG4113-3AG33-PF.jpg" },
  2: { arquivo: "sensor-fotoeletrico.jpg", autor: "Lucasbosch", licenca: "CC BY-SA 3.0", licencaUrl: "https://creativecommons.org/licenses/by-sa/3.0", fonte: "https://commons.wikimedia.org/wiki/File:SICK_WL12G-3B2531_Photoelectric_reflex_switch_angled1.png" },
  3: { arquivo: "clp-compacto.jpg", autor: "UlrichAAB", licenca: "CC BY-SA 3.0", licencaUrl: "https://creativecommons.org/licenses/by-sa/3.0", fonte: "https://commons.wikimedia.org/wiki/File:Simatic_S7-1200.JPG" },
  4: { arquivo: "clp-modular.jpg", autor: "Ulli1105", licenca: "CC BY-SA 2.5", licencaUrl: "https://creativecommons.org/licenses/by-sa/2.5", fonte: "https://commons.wikimedia.org/wiki/File:S7300.JPG" },
  5: { arquivo: "robo-colaborativo.jpg", autor: "Auledas", licenca: "CC BY-SA 4.0", licencaUrl: "https://creativecommons.org/licenses/by-sa/4.0", fonte: "https://commons.wikimedia.org/wiki/File:UR16e_robot_arm.png" },
  6: { arquivo: "robo-industrial.jpg", autor: "Phasmatisnox", licenca: "CC BY 3.0", licencaUrl: "https://creativecommons.org/licenses/by/3.0", fonte: "https://commons.wikimedia.org/wiki/File:FANUC_welding_robot_reaching.jpg" },
  7: { arquivo: "inversor.jpg", autor: "Suyash.dwivedi", licenca: "CC BY-SA 4.0", licencaUrl: "https://creativecommons.org/licenses/by-sa/4.0", fonte: "https://commons.wikimedia.org/wiki/File:Variable_Frequency_Drive_(VFD)_-_1.jpeg" },
  8: { arquivo: "servomotor.jpg", autor: "Kitmondo.com", licenca: "CC BY 2.0", licencaUrl: "https://creativecommons.org/licenses/by/2.0/", fonte: "https://www.flickr.com/photos/129143611@N03/15795543588" },
  9: { arquivo: "ihm.jpg", autor: "ZianMan", licenca: "CC BY-SA 4.0", licencaUrl: "https://creativecommons.org/licenses/by-sa/4.0", fonte: "https://commons.wikimedia.org/wiki/File:SIMATIC_HMI.jpg" },
  10: { arquivo: "cilindro.jpg", autor: "Grummelbacke", licenca: "CC BY-SA 4.0", licencaUrl: "https://creativecommons.org/licenses/by-sa/4.0", fonte: "https://commons.wikimedia.org/wiki/File:Pneumatic_cylinder.jpg" },
}

export function fotoDoProduto(id) {
  const foto = FOTOS[id]
  return foto ? { ...foto, src: ARQUIVOS[id] } : null
}
