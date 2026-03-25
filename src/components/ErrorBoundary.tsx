import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Ocorreu um erro inesperado.';
      
      try {
        const parsedError = JSON.parse(this.state.error?.message || '');
        if (parsedError.error && parsedError.error.includes('insufficient permissions')) {
          errorMessage = 'Você não tem permissão para acessar este recurso.';
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-accent p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-12 shadow-xl border border-black/5">
            <h2 className="text-3xl font-bold text-primary mb-4 italic">Ops! Algo deu errado.</h2>
            <p className="text-ink/60 mb-8 leading-relaxed">{errorMessage}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Recarregar Página
            </Button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
