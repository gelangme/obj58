import axios, { AxiosResponse } from "axios";

interface TranslationResponse {
  translations: Translation[] | null; // Adjust based on actual API response
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
async function translateWords(
  words: string[],
  targetLanguage: string
): Promise<Map<string, Translation[] | null>> {
  const promises = words.map(
    (word) =>
      axios
        .post<TranslationResponse>(
          "https://example-translation-api.com/translate",
          {
            q: word,
            target: targetLanguage,
          }
        )
        .then((response) => ({ word, data: response.data.translations || [] })) // Ensure `data` is always an array
  );

  try {
    const results = await Promise.all(promises);
    const resultMap = new Map<string, Translation[] | null>();

    results.forEach(({ word, data }) => {
      resultMap.set(word, data.length > 0 ? data : null); // Use `null` if array is empty
    });

    return resultMap;
  } catch (error) {
    console.error("Error translating words:", error);
    throw error;
  }
}

async function fetchSynonyms(query: string): Promise<SynonymResponse> {
  try {
    // Construct the URL with the query parameter
    const url = `https://www.openthesaurus.de/synonyme/search?q=${encodeURIComponent(
      query
    )}&format=application/json&similar=true`;

    // Make the GET request
    const response: AxiosResponse<SynonymResponse> = await axios.get(url);

    // Return the response dataå
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error fetching synonyms:", error);
    throw error;
  }
}

async function fetchSynonymsForMultipleWords(
  words: string[]
): Promise<Map<string, SynonymResponse>> {
  const results = new Map<string, SynonymResponse>();

  for (const word of words) {
    try {
      const data = await fetchSynonyms(word);
      results.set(word, data);
    } catch (error) {
      console.error("Error fetching synonyms for", word, ":", error);
    }
  }

  return results;
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

export interface Translation {
  word: string;
  translatedText: string;
}

interface ProcessedWordData {
  synonyms: SynonymResponse[];
  translations: Translation[];
}

export async function processWords(
  words: string[],
  targetLanguage: string
): Promise<ProcessedWordData> {
  try {
    const synonyms: SynonymResponse[] = [];
    const translations: Translation[] = [];

    // Simulate processing by adding dummy data
    words.forEach((word) => {
      synonyms.push({
        word,
        data: {
          license: "example-license",
          synsets: [{ lemma: word }],
        },
      });

      translations.push({
        word,
        translatedText: `${word} in ${targetLanguage}`,
      });
    });

    // Return the result as an object with arrays of synonyms and translations
    return {
      synonyms,
      translations,
    };
  } catch (error) {
    console.error("Error in processWords:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
