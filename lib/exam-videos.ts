// ========================================
// Exam Video Data - Ndolomath
// All content belongs to Ndolomath / Madame Mba
// ========================================
//
// HOW TO ADD VIDEOS FOR AN EXAM:
// ------------------------------
// 1. Find the correct class key (e.g. "3e" for BEPC, "TleD" for BAC D)
// 2. Find or add the year inside that class
// 3. Add video objects with: title (FR), titleEn (EN), and url (Cloudinary URL)
//
// Example:
//   "3e": {
//     2000: [
//       { title: "Partie A - Activites numeriques", titleEn: "Part A - Numerical activities", url: "https://res.cloudinary.com/..." },
//       { title: "Partie B - Geometrie", titleEn: "Part B - Geometry", url: "https://res.cloudinary.com/..." },
//     ],
//   },
//
// Video URLs should use Cloudinary for hosting.
// DO NOT host videos locally in the project.

export type ExamVideo = {
  title: string
  titleEn: string
  url: string
}

export const EXAM_VIDEOS: Record<string, Record<number, ExamVideo[]>> = {
  "3e": {
    1999: [
      {
        title: "BEPC 1999 - Partie 1",
        titleEn: "BEPC 1999 - Part 1",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770317344/Bepc_1999_tiktok_1_fovvvm.mp4",
      },
      {
        title: "BEPC 1999 - Partie 2",
        titleEn: "BEPC 1999 - Part 2",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770317411/BEPC_1999_tiktok_2_hek2br.mp4",
      },
      {
        title: "BEPC 1999 - Partie 3",
        titleEn: "BEPC 1999 - Part 3",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770317411/BEPC_1999_tiktok_2_hek2br.mp4",
      },
    ],
    2000: [
      {
        title: "BEPC 2000 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2000 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770317041/BEPC_2000_Partie_A_tiktok_d52on6.mp4",
      },
      {
        title: "BEPC 2000 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2000 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770317122/BEPC_2000_Partie_B_tiktok_vrsytc.mp4",
      },
      {
        title: "BEPC 2000 - Partie C (Probleme)",
        titleEn: "BEPC 2000 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770317264/Partie_C_bepc_2000_mjwg3u.mp4",
      },
    ],
    2001: [
      {
        title: "BEPC 2001 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2001 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770316865/2001_BEPC_partie_A_a2a1hs.mp4",
      },
      {
        title: "BEPC 2001 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2001 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770316927/2001_bepc_partie_B_edn8ir.mp4",
      },
      {
        title: "BEPC 2001 - Partie C (Probleme)",
        titleEn: "BEPC 2001 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770316975/2001_BEPC_partie_C_oit5st.mp4",
      },
    ],
    2002: [
      {
        title: "BEPC 2002 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2002 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770316635/bepc_2002_partie_A_k2gik6.mp4",
      },
      {
        title: "BEPC 2002 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2002 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770316714/bepc_2002_partie_B_ncqbta.mp4",
      },
      {
        title: "BEPC 2002 - Partie C (Probleme)",
        titleEn: "BEPC 2002 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770316791/bepc_2002_partie_C_cbz7ut.mp4",
      },
    ],
    2003: [
      {
        title: "BEPC 2003 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2003 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770316052/2003_bepc_partie_A_njsr1y.mp4",
      },
      {
        title: "BEPC 2003 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2003 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770316116/2003_BEPC_partie_B_ccgqlp.mp4",
      },
      {
        title: "BEPC 2003 - Partie C (Probleme)",
        titleEn: "BEPC 2003 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770316172/2003_BEPC_PARTIE_C_zqnkxs.mp4",
      },
    ],
    2004: [
      {
        title: "BEPC 2004 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2004 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770315780/2004_bepc_partie_A_v5e3ot.mp4",
      },
      {
        title: "BEPC 2004 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2004 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770315909/2004_partie_B_r7adt3.mp4",
      },
      {
        title: "BEPC 2004 - Partie C (Probleme)",
        titleEn: "BEPC 2004 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770315976/2004_BEPC_Partie_C_mc9yxb.mp4",
      },
    ],
    2005: [
      {
        title: "BEPC 2005 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2005 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770317590/2005_BEPC_partie_A_pj8zmx.mp4",
      },
      {
        title: "BEPC 2005 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2005 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770317659/Partie_B_BEPC_2005_hybiof.mp4",
      },
      {
        title: "BEPC 2005 - Partie C (Probleme)",
        titleEn: "BEPC 2005 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770317726/Partie_C_Bepc_2005_iy3jzl.mp4",
      },
    ],
    2006: [
      {
        title: "BEPC 2006 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2006 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770315439/BEPC_2006_partie_A_cjpabn.mp4",
      },
      {
        title: "BEPC 2006 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2006 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770315521/bepc_2006_Partie_B_jeumzh.mp4",
      },
      {
        title: "BEPC 2006 - Partie C (Probleme)",
        titleEn: "BEPC 2006 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770315610/Bepc_2006_partie_C_lzxl8n.mp4",
      },
    ],
    2007: [
      {
        title: "BEPC 2007 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2007 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770315122/bepc_2007_partie_A_thdz9g.mp4",
      },
      {
        title: "BEPC 2007 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2007 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770315195/bepc_2007_partie_B_mkvjdj.mp4",
      },
      {
        title: "BEPC 2007 - Partie C (Probleme)",
        titleEn: "BEPC 2007 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770315289/_bepc_2007_partie_C_ov6mtp.mp4",
      },
    ],
    2008: [
      {
        title: "BEPC 2008 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2008 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770314857/bepc_2008_partie_A_yifxin.mp4",
      },
      {
        title: "BEPC 2008 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2008 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770314961/bepc_2008_partie_B_ftgvmh.mp4",
      },
      {
        title: "BEPC 2008 - Partie C (Probleme)",
        titleEn: "BEPC 2008 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770315051/BEPC_2008_partie_C_hoa8bi.mp4",
      },
    ],
    2009: [
      {
        title: "BEPC 2009 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2009 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770314487/BEPC_2009_Partie_A_apgxkh.mp4",
      },
      {
        title: "BEPC 2009 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2009 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770314631/BEPC_2009_Partie_B_pcqnji.mp4",
      },
      {
        title: "BEPC 2009 - Partie C (Probleme)",
        titleEn: "BEPC 2009 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770314767/BEPC_2009_Partie_C_gmvrfk.mp4",
      },
    ],
    2010: [
      {
        title: "BEPC 2010 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2010 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770314113/BEPC_2010_Partie_A_n5xrup.mp4",
      },
      {
        title: "BEPC 2010 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2010 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770314235/BEPC_2010_Partie_B_qakgdp.mp4",
      },
      {
        title: "BEPC 2010 - Partie C (Probleme)",
        titleEn: "BEPC 2010 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770314338/BEPC_2010_Partie_C_mvpvht.mp4",
      },
    ],
    2011: [
      {
        title: "BEPC 2011 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2011 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770313728/BEPC_2011_Partie_A_eckc5s.mp4",
      },
      {
        title: "BEPC 2011 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2011 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770313865/BEPC_2011_Partie_B_trjkqb.mp4",
      },
      {
        title: "BEPC 2011 - Partie C (Probleme)",
        titleEn: "BEPC 2011 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770313973/BEPC_2011_Partie_C_jbpfkr.mp4",
      },
    ],
    2012: [
      {
        title: "BEPC 2012 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2012 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770313303/BEPC_2012_Partie_A_a8xa7z.mp4",
      },
      {
        title: "BEPC 2012 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2012 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770313411/BEPC_2012_Partie_B_waxova.mp4",
      },
      {
        title: "BEPC 2012 - Partie C (Probleme)",
        titleEn: "BEPC 2012 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770313552/BEPC_2012_Partie_C_hauymi.mp4",
      },
    ],
    2013: [
      {
        title: "BEPC 2013 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2013 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770312820/bepc_2013_Partie_A_dlpous.mp4",
      },
      {
        title: "BEPC 2013 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2013 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770312972/bepc_2013_Partie_B_iagfyw.mp4",
      },
      {
        title: "BEPC 2013 - Partie C (Probleme)",
        titleEn: "BEPC 2013 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770313121/bepc_2013_Partie_C_arwbmx.mp4",
      },
    ],
    2014: [
      {
        title: "BEPC 2014 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2014 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770312326/BEPC_2014_Partie_A_d873vc.mp4",
      },
      {
        title: "BEPC 2014 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2014 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770312435/BEPC_2014_Partie_B_y1ufrk.mp4",
      },
      {
        title: "BEPC 2014 - Partie C (Probleme)",
        titleEn: "BEPC 2014 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770312589/BEPC_2014_Partie_C_pxovit.mp4",
      },
    ],
    2015: [
      {
        title: "BEPC 2015 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2015 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770311958/BEPC_2015_Partie_A_sbvcyw.mp4",
      },
      {
        title: "BEPC 2015 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2015 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770312075/BEPC_2015_Partie_B_ls9i70.mp4",
      },
      {
        title: "BEPC 2015 - Partie C (Probleme)",
        titleEn: "BEPC 2015 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770312202/BEPC_2015_Partie_C_tus4cr.mp4",
      },
    ],
    2016: [
      {
        title: "BEPC 2016 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2016 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770311491/BEPC_2016_Partie_A_ohopma.mp4",
      },
      {
        title: "BEPC 2016 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2016 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770311610/BEPC_2016_Partie_B_b1rwdv.mp4",
      },
      {
        title: "BEPC 2016 - Partie C (Probleme)",
        titleEn: "BEPC 2016 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770311712/BEPC_2016_Partie_C_r7zrmj.mp4",
      },
    ],
    2017: [
      {
        title: "BEPC 2017 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2017 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770311196/BEPC_2017_Partie_A_ccwfu9.mp4",
      },
      {
        title: "BEPC 2017 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2017 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770311294/BEPC_2017_Partie_B_di3ety.mp4",
      },
      {
        title: "BEPC 2017 - Partie C (Probleme)",
        titleEn: "BEPC 2017 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770311373/BEPC_2017_Partie_C_ln9r2o.mp4",
      },
    ],
    2018: [
      {
        title: "BEPC 2018 - Partie A (Evaluation des ressources)",
        titleEn: "BEPC 2018 - Part A (Resource assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770310798/BEPC_2018_Partie_A_tov79l.mp4",
      },
      {
        title: "BEPC 2018 - Partie B (Evaluation des competences)",
        titleEn: "BEPC 2018 - Part B (Skills assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770310894/BEPC_2018_Partie_B_ioc1hl.mp4",
      },
      {
        title: "BEPC 2018 - Partie C",
        titleEn: "BEPC 2018 - Part C",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770311032/BEPC_2018_Partie_C_r7rgym.mp4",
      },
    ],
    2019: [
      {
        title: "BEPC 2019 - Partie A (Evaluation des ressources)",
        titleEn: "BEPC 2019 - Part A (Resource assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770310483/BEPC_2019_Partie_A_qda2gv.mp4",
      },
      {
        title: "BEPC 2019 - Partie B (Evaluation des competences)",
        titleEn: "BEPC 2019 - Part B (Skills assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770310561/BEPC_2019_Partie_B_o59rbw.mp4",
      },
      {
        title: "BEPC 2019 - Partie C",
        titleEn: "BEPC 2019 - Part C",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770310679/BEPC_2019_Partie_C_jng53i.mp4",
      },
    ],
    2020: [
      {
        title: "BEPC 2020 - Partie A (Evaluation des ressources)",
        titleEn: "BEPC 2020 - Part A (Resource assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770310085/BEPC_2020_Partie_A_gy1aao.mp4",
      },
      {
        title: "BEPC 2020 - Partie B (Evaluation des competences)",
        titleEn: "BEPC 2020 - Part B (Skills assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770310179/BEPC_2020_Partie_B_dopdwa.mp4",
      },
      {
        title: "BEPC 2020 - Partie C",
        titleEn: "BEPC 2020 - Part C",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770310332/BEPC_2020_Partie_C_onl0c9.mp4",
      },
    ],
    2021: [
      {
        title: "BEPC 2021 - Partie A (Evaluation des ressources)",
        titleEn: "BEPC 2021 - Part A (Resource assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770309561/BEPC_2021_Partie_A_guywlg.mp4",
      },
      {
        title: "BEPC 2021 - Partie B (Evaluation des competences)",
        titleEn: "BEPC 2021 - Part B (Skills assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770309682/BEPC_2021_Partie_B_sububt.mp4",
      },
      {
        title: "BEPC 2021 - Partie C",
        titleEn: "BEPC 2021 - Part C",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770309987/BEPC_2021_Partie_C_ovrep2.mp4",
      },
    ],
    2022: [
      {
        title: "BEPC 2022 - Partie A (Evaluation des ressources)",
        titleEn: "BEPC 2022 - Part A (Resource assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770309221/BEPC_2022_Partie_A_aqd22f.mp4",
      },
      {
        title: "BEPC 2022 - Partie B (Evaluation des competences)",
        titleEn: "BEPC 2022 - Part B (Skills assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770309374/BEPC_2022_Partie_B_hqqijy.mp4",
      },
      {
        title: "BEPC 2022 - Partie C",
        titleEn: "BEPC 2022 - Part C",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770309439/BEPC_2022_Partie_C_ebwiao.mp4",
      },
    ],
    2023: [
      {
        title: "BEPC 2023 - Partie A (Evaluation des ressources)",
        titleEn: "BEPC 2023 - Part A (Resource assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770308739/BEPC_2023_Partie_A_pxnnws.mp4",
      },
      {
        title: "BEPC 2023 - Partie B (Evaluation des competences)",
        titleEn: "BEPC 2023 - Part B (Skills assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770308899/BEPC_2023_Partie_B_nxb575.mp4",
      },
      {
        title: "BEPC 2023 - Partie C",
        titleEn: "BEPC 2023 - Part C",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770309041/BEPC_2023_Partie_C_sfjbtx.mp4",
      },
    ],
    2024: [
      {
        title: "BEPC 2024 - Partie A (Evaluation des ressources)",
        titleEn: "BEPC 2024 - Part A (Resource assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770308168/BEPC_2024_Partie_A_iu3bnr.mp4",
      },
      {
        title: "BEPC 2024 - Partie B (Evaluation des competences)",
        titleEn: "BEPC 2024 - Part B (Skills assessment)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770308290/BEPC_2024_Partie_B_bqlb5a.mp4",
      },
      {
        title: "BEPC 2024 - Partie B (suite)",
        titleEn: "BEPC 2024 - Part B (continued)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770308290/BEPC_2024_Partie_B_bqlb5a.mp4",
      },
    ],
    2025: [
      {
        title: "BEPC 2025 - Partie A (Activites numeriques)",
        titleEn: "BEPC 2025 - Part A (Numerical activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770307538/BEPC_2025_PARTIE_A_ucpqe4.mp4",
      },
      {
        title: "BEPC 2025 - Partie B (Activites geometriques)",
        titleEn: "BEPC 2025 - Part B (Geometry activities)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770307615/BEPC_2025_PARTIE_B_gwiqio.mp4",
      },
      {
        title: "BEPC 2025 - Partie C (Probleme)",
        titleEn: "BEPC 2025 - Part C (Problem)",
        url: "https://res.cloudinary.com/db5gyc812/video/upload/v1770307695/BEPC_2025_PARTIE_C_ululw3.mp4",
      },
    ],
  },
}

/** Get exam videos for a given class and year */
export function getExamVideos(classId: string, year: number): ExamVideo[] {
  return EXAM_VIDEOS[classId]?.[year] ?? []
}

// ========================================
// Mathematician Biography Videos
// ========================================
//
// HOW TO ADD VIDEOS FOR A MATHEMATICIAN:
// --------------------------------------
// Add an entry with the mathematician's name (must match exactly the name in MATHEMATICIANS_DATA):
//
//   "Euclide": [
//     { title: "Biographie d'Euclide", titleEn: "Biography of Euclid", url: "https://res.cloudinary.com/..." },
//   ],
//

export const MATHEMATICIAN_VIDEOS: Record<string, ExamVideo[]> = {
  // Add mathematician biography videos here
  // Example:
  // "Euclide": [
  //   { title: "Biographie d'Euclide", titleEn: "Biography of Euclid", url: "https://res.cloudinary.com/..." },
  // ],
}

/** Get biography videos for a given mathematician */
export function getMathematicianVideos(name: string): ExamVideo[] {
  return MATHEMATICIAN_VIDEOS[name] ?? []
}
