import React, { useEffect, useState } from 'react';

const UserCodeLoader = ({ questionId, onCodeLoad }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCode = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.log('No token found, skipping code fetch');
          return;
        }

        const response = await fetch(`http://localhost:8000/questions/${questionId}/user-code`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            // No previous submission found - this is a normal case
            console.log('No previous submission found');
            return;
          }
          throw new Error(data.detail || 'Failed to fetch user code');
        }

        if (data.code_data) {
          console.log('Loading previous code submission');
          onCodeLoad(data.code_data);
        }
      } catch (err) {
        console.error('Error fetching user code:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (questionId) {
      fetchUserCode();
    }
  }, [questionId, onCodeLoad]);

  if (error) {
    return (
      <div className="text-sm text-red-500 p-2 bg-red-50 rounded mb-2">
        Error loading previous code: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-sm text-blue-500 p-2 bg-blue-50 rounded mb-2">
        Loading previous submission...
      </div>
    );
  }

  return null;
};

export default UserCodeLoader;