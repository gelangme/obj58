import axios, { AxiosResponse } from "axios";
import moby from "moby";

interface Term {
  term: string;
  level?: string; // Optional, as not all terms have this property
}

// Interface for each synset
interface Synset {
  id: number;
  categories: string[]; // Array of categories, could be empty
  terms: Term[]; // Array of terms
}

// Interface for the metadata
interface MetaData {
  apiVersion: string;
  warning: string;
  copyright: string;
  license: string;
  source: string;
  date: string;
}

// Interface for the full JSON response
export interface OpenThesaurusResponse {
  metaData: MetaData;
  synsets: Synset[];
  similarterms: { distance: number; term: string }[];
}

export interface SynonymResponse {
  word: string;
  data: {
    license: string;
    synsets: Array<{
      lemma: string;
      // other fields can be added here
    }>;
  };
}

export interface DatamuseResponse {
  word: string;
  score?: number;
  tags?: string[];
  [key: string]: any;
}

interface ProcessedWordData {
  synonyms: (OpenThesaurusResponse | null)[];
  translations: (string | null)[];
}

export const translateText = async (text: string, targetLanguage: string) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      q: text,
      target: targetLanguage,
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return null;
  }
};

export async function translateWords(
  words: string[],
  targetLanguage: string
): Promise<(string | null)[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  // Map each word to a promise that resolves to its translation data
  const promises = words.map((word) =>
    axios
      .post(url, {
        q: word,
        target: targetLanguage,
      })
      .then((response) => response.data.data.translations[0].translatedText)
      .catch((error) => {
        console.error(`Error translating word "${word}":`, error);
        return null;
      })
  );

  try {
    // Await all promises and collect results into an array
    return await Promise.all(promises);
  } catch (error) {
    console.error("Error translating words:", error);
    throw error;
  }
}

async function fetchSynonyms(
  query: string
): Promise<OpenThesaurusResponse | null> {
  try {
    // Construct the URL with the query parameter
    const url = `https://www.openthesaurus.de/synonyme/search?q=${encodeURIComponent(
      query
    )}&format=application/json&similar=true`;

    // Make the GET request
    const response: AxiosResponse<OpenThesaurusResponse | null> =
      await axios.get(url);

    // Return the response dataå
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error fetching synonyms:", error);
    throw error;
  }
}

async function fetchSynonymsForMultipleWordsDe(
  words: string[]
): Promise<(OpenThesaurusResponse | null)[]> {
  const results: (OpenThesaurusResponse | null)[] = [];

  for (const word of words) {
    try {
      const data = await fetchSynonyms(word);
      results.push(data);
    } catch (error) {
      console.error("Error fetching synonyms for", word, ":", error);
      // Push an object with `word` and `synonyms` set to null or empty response
      results.push(null);
    }
  }

  return results;
}

// Function to fetch synonyms or related words from Datamuse API
async function fetchSynonymsFromDatamuse(
  query: string
): Promise<DatamuseResponse[] | null> {
  try {
    // Construct the URL with the query parameter
    const url = `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(
      query
    )}`;

    // Make the GET request
    const response: AxiosResponse<DatamuseResponse[]> = await axios.get(url);

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error fetching data from Datamuse:", error);
    throw error;
  }
}

async function fetchSynonymsForMultipleWordsEn(
  words: (string | null)[]
): Promise<(DatamuseResponse[] | null)[]> {
  const results: (DatamuseResponse[] | null)[] = [];

  for (const word of words) {
    try {
      if (word === null) {
        results.push(null);
      } else {
        const data = await fetchSynonymsFromDatamuse(word);
        if (Array.isArray(data)) {
          results.push(data?.slice(0, 5));
        }
      }
    } catch (error) {
      console.error("Error fetching synonyms for", word, ":", error);
      // Push an object with `word` and `synonyms` set to null or empty response
      results.push(null);
    }
  }

  return results;
}

export async function processWords(
  words: string[],
  targetLanguage: string
): Promise<{
  synonyms: (DatamuseResponse[] | null)[];
  translations: (string | null)[];
}> {
  try {
    //targetLanguage = "de" ? Fetch synonyms for each word from OpenThesaurus

    // Fetch translations for each word
    const translations = await translateWords(words, targetLanguage);

    // Fetch translations for each word
    const synonyms = await fetchSynonymsForMultipleWordsEn(translations);

    // Return the combined result
    return { synonyms, translations };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
