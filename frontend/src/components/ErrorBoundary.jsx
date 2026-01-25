import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 bg-zinc-950 text-red-500 font-mono h-screen overflow-auto">
                    <h1 className="text-3xl font-bold mb-4">CRITICAL SYSTEM FAILURE</h1>
                    <div className="bg-zinc-900/50 p-6 border border-red-900 rounded">
                        <h2 className="text-xl text-white mb-2">Error Trace:</h2>
                        <pre className="whitespace-pre-wrap text-sm text-red-400">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <br />
                        <details className="text-zinc-500">
                            <summary>Component Stack</summary>
                            <pre className="text-xs mt-2">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
