import os
from tavily import TavilyClient
from duckduckgo_search import DDGS
from dotenv import load_dotenv

load_dotenv()

class SearchService:
    def __init__(self):
        self.tavily_key = os.environ.get("TAVILY_API_KEY")
        if self.tavily_key:
            self.tavily = TavilyClient(api_key=self.tavily_key)
        else:
            self.tavily = None

    def search(self, query: str, max_results=5):
        """
        Executes search using Tavily (Primary) or DuckDuckGo (Fallback).
        """
        print(f"🔍 SEARCHING: {query}")
        
        # 1. Try Tavily
        if self.tavily:
            try:
                print("   Using: Tavily API")
                response = self.tavily.search(query=query, max_results=max_results)
                # Tavily returns a dict with 'results' list
                return response.get("results", [])
            except Exception as e:
                print(f"   ⚠️ Tavily Error: {e}")

        # 2. Fallback to DuckDuckGo
        print("   Using: DuckDuckGo (Fallback)")
        try:
            results = list(DDGS().text(query, max_results=max_results))
            return results
        except Exception as e:
            print(f"   ❌ DDGS Error: {e}")
            return []

# Singleton
search_engine = SearchService()

if __name__ == "__main__":
    # Test run
    results = search_engine.search("Current CEO of Google")
    for i, res in enumerate(results):
        print(f"{i+1}. {res.get('title')} - {res.get('url')}")
