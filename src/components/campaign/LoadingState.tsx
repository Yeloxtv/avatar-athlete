import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-spin">⚙️</div>
        <p className="text-muted-foreground">Chargement des quêtes...</p>
      </div>
    </div>
  );
};
