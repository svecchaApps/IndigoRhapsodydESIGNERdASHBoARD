import styled from "styled-components";

export const CommissionsScreenWrap = styled.main`
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;

  .page-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e2e8f0;

    .header-content {
      .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 0.5rem 0;
        line-height: 1.2;
      }

      .page-subtitle {
        color: #64748b;
        font-size: 1rem;
        margin: 0;
        line-height: 1.5;
      }
    }
  }

  .loading-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 1rem;
    border: 1px solid #f1f5f9;
    text-align: center;

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    p {
      margin-top: 1rem;
      color: #64748b;
      font-size: 0.875rem;
    }

    .empty-icon {
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    p {
      margin: 0;
      color: #64748b;
      font-size: 0.875rem;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    .stat-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      border: 1px solid #f1f5f9;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 1rem;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .stat-card-header {
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;

          &.bg-blue-500 {
            background: #3b82f6;
          }
          &.bg-amber-500 {
            background: #f59e0b;
          }
          &.bg-emerald-500 {
            background: #10b981;
          }
        }
      }

      .stat-content {
        flex: 1;

        .stat-title {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0 0 0.25rem 0;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          line-height: 1.2;
        }
      }
    }
  }

  .commission-summary {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 1rem 0;
    }

    .summary-content {
      p {
        margin: 0;
        color: #475569;
        font-size: 1rem;
        line-height: 1.6;

        strong {
          color: #1e293b;
          font-weight: 600;
        }
      }
    }
  }
`;
