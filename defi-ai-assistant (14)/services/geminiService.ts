
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import type { Wallet, TrendingCrypto, TrendingStock, CourseContent, NewsArticle } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock response.");
}

export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// --- Tool Declarations for the Assistant ---

export const transactionFunctionDeclaration: FunctionDeclaration = {
  name: 'execute_transaction',
  description: 'Initiates a cryptocurrency transaction, such as sending tokens. The user must confirm all transactions. The amount can be specified either as a quantity of tokens (e.g., 0.5 ETH) or as a USD value (e.g., $100 of ETH). One of `amount` or `usdAmount` must be provided.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: {
        type: Type.STRING,
        description: 'The type of transaction. Currently only "SEND" is supported by this tool.',
        enum: ['SEND'],
      },
      tokenSymbol: {
        type: Type.STRING,
        description: 'The symbol of the cryptocurrency token to send (e.g., "ETH", "USDC", "PEPE").',
      },
      amount: {
        type: Type.NUMBER,
        description: 'The quantity of the token to send. Use this if the user specifies a token amount directly.',
      },
      usdAmount: {
        type: Type.NUMBER,
        description: 'The value in USD of the token to send. Use this if the user specifies an amount in dollars.',
      },
      recipientAddress: {
        type: Type.STRING,
        description: 'The wallet address of the recipient.',
      },
    },
    required: ['action', 'tokenSymbol', 'recipientAddress'],
  },
};

export const getWalletBalanceFunctionDeclaration: FunctionDeclaration = {
    name: 'get_wallet_balance',
    description: "Retrieves the user's current cryptocurrency wallet balance and total portfolio value. Use this when the user asks 'what's my balance?', 'how much money do I have?', etc.",
    parameters: {
        type: Type.OBJECT,
        properties: {},
    },
};

export const scheduleBridgeFunctionDeclaration: FunctionDeclaration = {
    name: 'schedule_bridge',
    description: 'Schedule a recurring bridge transaction to move funds between chains automatically.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            frequency: { type: Type.STRING, description: 'How often to bridge (e.g., "weekly", "monthly", "every Friday").' },
            amount: { type: Type.NUMBER, description: 'Amount to bridge per interval.' },
            asset: { type: Type.STRING, description: 'The asset symbol (e.g., USDC, APT).' },
            sourceChain: { type: Type.STRING, description: 'Source chain.' },
            destinationChain: { type: Type.STRING, description: 'Destination chain.' }
        },
        required: ['frequency', 'destinationChain']
    }
};

export const investYieldFunctionDeclaration: FunctionDeclaration = {
    name: 'invest_yield',
    description: 'Invest a portion of the wallet into yield farming pools on Aptos.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            percentage: { type: Type.NUMBER, description: 'Percentage of wallet balance to invest (0-100).' },
            riskLevel: { type: Type.STRING, description: 'Risk tolerance level.', enum: ['low', 'medium', 'high'] },
            protocol: { type: Type.STRING, description: 'Specific protocol name if mentioned (e.g., Thala, Aries).' }
        },
        required: ['percentage']
    }
};

export const trackTokenActivityFunctionDeclaration: FunctionDeclaration = {
    name: 'track_token_activity',
    description: 'Set up an agent to track and alert on specific on-chain token metrics like volume spikes or holder count changes.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            metric: { type: Type.STRING, description: 'Metric to track (e.g., "volume", "holders", "transactions").' },
            condition: { type: Type.STRING, description: 'Condition to trigger alert (e.g., "increase", "spike", "dump").' }
        },
        required: ['metric']
    }
};

export const setTvlAlertFunctionDeclaration: FunctionDeclaration = {
    name: 'set_tvl_alert',
    description: 'Set an alert for Total Value Locked (TVL) changes in Aptos DEXs or protocols.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            protocol: { type: Type.STRING, description: 'Protocol name (optional, defaults to "any").' },
            direction: { type: Type.STRING, description: 'Direction of change (increase/decrease).' },
            threshold: { type: Type.STRING, description: 'Specific threshold if mentioned (e.g., "10%", "$1M").' }
        },
        required: ['direction']
    }
};


// --- Other AI Services ---

export const fetchDeFiExplanation = async (protocolName: string, question: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return `This is a mock AI explanation for the question: "${question}" regarding the ${protocolName} protocol. 
        \nIn a real application, the AI would generate a clear, concise, and easy-to-understand explanation tailored to a beginner audience. 
        \nFor example, if asked about risks, it would likely cover smart contract risk, market risk, and impermanent loss in a simple way.`;
    }
    const prompt = `For the DeFi protocol "${protocolName}", please provide a simple, beginner-friendly explanation for the following question: "${question}".
    \nYour tone should be educational and reassuring. Avoid overly technical jargon. Focus on clarity and conciseness. Use Google Search to ensure your information is accurate and up-to-date.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        return response.text;
    } catch (error) {
        console.error(`Error fetching DeFi explanation for "${protocolName}":`, error);
        return "Sorry, I was unable to generate an explanation at this time. Please check your connection or try again later.";
    }
};

export const analyzeMarketWithAI = async (marketId: string, marketData: any, question: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return "Mock AI Analysis: The market is showing high volatility with significant volume. Traders should exercise caution and watch for key support levels.";
    }
    
    // Construct a context string from the market data object
    const context = `
        Market: ${marketId}
        Current Price: $${marketData.price}
        24h Change: ${marketData.change_24h}%
        24h Volume: $${marketData.volume_24h}
        24h High: $${marketData.high_24h}
        24h Low: $${marketData.low_24h}
    `;
    
    const prompt = `You are an expert crypto market analyst.
    
    Market Data Context:
    ${context}
    
    User Question: "${question}"
    
    Please provide a concise, data-driven insight based on the provided metrics. Keep it short (2-3 sentences). Focus on technical analysis, volume trends, or market sentiment.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing market:", error);
        return "Unable to analyze market at this moment. Please try again later.";
    }
};


export const fetchNews = async (): Promise<NewsArticle[]> => {
    const url = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';
    try {
        const apiResponse = await fetch(url);
        if (!apiResponse.ok) {
            throw new Error(`CryptoCompare API responded with status: ${apiResponse.status}`);
        }
        const newsData = await apiResponse.json();

        if (!newsData.Data) {
            throw new Error("Invalid data structure from news API");
        }

        return newsData.Data.slice(0, 20).map((article: any) => ({
            title: article.title,
            uri: article.url,
            source: article.source_info.name,
            imageUrl: article.imageurl,
        }));
    } catch (error) {
        console.error("Error fetching news from CryptoCompare:", error);
        throw new Error("Failed to fetch news.");
    }
};

export const fetchJobsAndEvents = async () => {
    if (!process.env.API_KEY) {
        return {
            jobs: [{ title: 'Mock Web3 Developer', company: 'Crypto Corp', location: 'Remote', url: '#' }],
            events: [{ name: 'Mock Web3 Summit', date: 'Oct 2024', location: 'Virtual', url: '#' }]
        };
    }
    const prompt = "List 4 recent job vacancies in Web3 companies and 4 upcoming global Web3 events.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        jobs: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    company: { type: Type.STRING },
                                    location: { type: Type.STRING },
                                    url: { type: Type.STRING }
                                },
                                required: ['title', 'company', 'location', 'url']
                            }
                        },
                        events: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    date: { type: Type.STRING },
                                    location: { type: Type.STRING },
                                    url: { type: Type.STRING }
                                },
                                required: ['name', 'date', 'location', 'url']
                            }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error fetching jobs and events:", error);
        throw new Error("Failed to fetch jobs and events.");
    }
};

export const fetchTrendingCryptos = async (): Promise<TrendingCrypto[]> => {
    if (!process.env.API_KEY) {
        return [
            { name: 'Notcoin', symbol: 'NOT' },
            { name: 'Turbo', symbol: 'TURBO' },
            { name: 'Bonk', symbol: 'BONK' },
            { name: 'Maga', symbol: 'TRUMP' },
            { name: 'Gamestop', symbol: 'GME' },
        ];
    }

    const prompt = "List the top 5 trending cryptocurrencies today. Format the response as a numbered list. For each item, provide the full name followed by the ticker symbol in parentheses. Example: 1. Bitcoin (BTC)";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const cryptos: TrendingCrypto[] = [];
        const lines = text.split('\n');
        const regex = /^\d+\.\s*(.+?)\s+\(([^)]+)\)/;

        for (const line of lines) {
            const match = line.match(regex);
            if (match && match[1] && match[2]) {
                cryptos.push({
                    name: match[1].trim(),
                    symbol: match[2].trim().toUpperCase(),
                });
            }
        }
        
        if (cryptos.length === 0) {
            console.warn("Could not parse trending cryptos from response:", text);
            return [];
        }

        return cryptos.slice(0, 5);

    } catch (error) {
        console.error("Error fetching trending cryptos:", error);
        throw new Error("Failed to fetch trending cryptos.");
    }
};

export const fetchTrendingStocks = async (): Promise<TrendingStock[]> => {
    if (!process.env.API_KEY) {
        return [
            { name: 'NVIDIA Corp', symbol: 'NASDAQ:NVDA' },
            { name: 'Tesla Inc', symbol: 'NASDAQ:TSLA' },
            { name: 'Apple Inc', symbol: 'NASDAQ:AAPL' },
            { name: 'Gamestop Corp', symbol: 'NYSE:GME' },
            { name: 'Amazon.com Inc', symbol: 'NASDAQ:AMZN' },
        ];
    }

    const prompt = "List the top 5 trending stocks today. Format the response as a numbered list. For each item, provide the full name followed by the TradingView-compatible ticker symbol in parentheses, including the exchange. Example: 1. Apple Inc. (NASDAQ:AAPL)";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const stocks: TrendingStock[] = [];
        const lines = text.split('\n');
        const regex = /^\d+\.\s*(.+?)\s+\(([^)]+)\)/;

        for (const line of lines) {
            const match = line.match(regex);
            if (match && match[1] && match[2]) {
                stocks.push({
                    name: match[1].trim(),
                    symbol: match[2].trim().toUpperCase(),
                });
            }
        }
        
        if (stocks.length === 0) {
            console.warn("Could not parse trending stocks from response:", text);
            return [];
        }

        return stocks.slice(0, 5);

    } catch (error) {
        console.error("Error fetching trending stocks:", error);
        throw new Error("Failed to fetch trending stocks.");
    }
};

export const fetchCourseContent = async (topic: string, level: string): Promise<CourseContent> => {
    if (!process.env.API_KEY) {
        return {
            title: `Understanding ${topic}`,
            explanation: `This is a mock explanation for "${topic}" aimed at a ${level} audience. In a real application, this content would be generated by a powerful AI to provide a clear and concise breakdown of the concept, tailored to your learning level.`,
            example: `// Example code would go here\nmodule 0x42::MockModule {\n    use std::signer;\n}`,
            quiz: {
                question: `What is a primary characteristic of a ${topic.toLowerCase()}?`,
                options: ['Centralization', 'Immutability', 'Opacity', 'Reversibility'],
                correctAnswer: 'Immutability'
            }
        };
    }
    
    const prompt = `You are an expert Aptos Learning Instructor.
    Create a structured lesson for the topic "${topic}" at the "${level}" level.
    
    Your response must focus ONLY on the Aptos blockchain and the Move programming language.
    
    1. **Explanation**: Provide a clear, educational summary of the concept. Explain "why" and "how".
    2. **Example**: Provide a concrete example. If applicable, provide a Move language code snippet or a TypeScript snippet using the Aptos SDK. If it's a conceptual topic, provide a real-world analogy.
    3. **Quiz**: Create a relevant multiple-choice question to test understanding.
    
    Return the response in JSON format.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        example: { type: Type.STRING },
                        quiz: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                options: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING }
                                },
                                correctAnswer: { type: Type.STRING }
                            },
                            required: ['question', 'options', 'correctAnswer']
                        }
                    },
                    required: ['title', 'explanation', 'example', 'quiz']
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error(`Error fetching course content for "${topic}":`, error);
        return {
            title: `Error: ${topic}`,
            explanation: "Could not fetch the course content at this time. Please check your connection or try again later.",
            example: "",
            quiz: {
                question: "Error loading quiz.",
                options: [],
                correctAnswer: ""
            }
        };
    }
};

export const summarizeArticleByTitle = async (title: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return `This is a mock summary for the article titled: "${title}".\n\nIn a real scenario, the AI would generate a detailed, multi-paragraph summary here, elaborating on the key points suggested by the headline. This would provide users with the essential information without them needing to leave the application.\n\nFor instance, if the title was about a new Ethereum upgrade, the summary would likely discuss its potential impact on gas fees, transaction speed, and the broader ecosystem.`;
    }

    const prompt = `Based on the following news headline, please generate a plausible, well-structured, multi-paragraph summary of what the article is likely about. The summary should be informative and read like a concise news report. Do not mention that you are guessing or inferring from the title. Just write the summary as if you have read the article.\n\nHeadline: "${title}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating article summary:", error);
        return "Sorry, I was unable to generate a summary for this article at the moment. You can still read the full story at the source.";
    }
};
