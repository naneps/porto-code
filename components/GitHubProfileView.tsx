
import React, { useState, useEffect } from 'react';
import { GitHubUser, GitHubEvent, GitHubRepo, MockGitHubStats, LogLevel } from '../types';
import { ICONS, MOCK_GITHUB_STATS } from '../constants';
import { Github, Users, Eye, Star, GitFork, Briefcase, MapPin, Link as LinkIcon, ExternalLink, AlertTriangle, Loader2, MessageSquare, GitCommit, Tag } from 'lucide-react';

interface GitHubProfileViewProps {
  username: string | undefined;
  mockStats: MockGitHubStats;
  addAppLog: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void;
}

const GITHUB_API_BASE_URL = 'https://api.github.com';

const GitHubProfileView: React.FC<GitHubProfileViewProps> = ({ username, mockStats, addAppLog }) => {
  const [profile, setProfile] = useState<GitHubUser | null>(null);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setError("GitHub username is not configured for this view.");
      addAppLog('error', "GitHub username not provided to GitHubProfileView.", 'GitHubProfileView');
      return;
    }

    const fetchGitHubData = async () => {
      setLoading(true);
      setError(null);
      addAppLog('info', `Fetching GitHub data for user: ${username}`, 'GitHubProfileView');

      try {
        const [profileRes, eventsRes, reposRes] = await Promise.all([
          fetch(`${GITHUB_API_BASE_URL}/users/${username}`),
          fetch(`${GITHUB_API_BASE_URL}/users/${username}/events/public?per_page=10`), // Fetching 10 most recent public events
          fetch(`${GITHUB_API_BASE_URL}/users/${username}/repos?sort=updated&per_page=100`)
        ]);

        if (!profileRes.ok) {
            if (profileRes.status === 403 && profileRes.headers.get('X-RateLimit-Remaining') === '0') throw new Error('API rate limit exceeded (profile). Try again later.');
            throw new Error(`Failed to fetch GitHub profile: ${profileRes.statusText}`);
        }
        const profileData: GitHubUser = await profileRes.json();
        setProfile(profileData);
        addAppLog('debug', 'GitHub profile data fetched.', 'GitHubProfileView', { name: profileData.name });

        if (!eventsRes.ok) {
            if (eventsRes.status === 403 && eventsRes.headers.get('X-RateLimit-Remaining') === '0') throw new Error('API rate limit exceeded (events). Try again later.');
            throw new Error(`Failed to fetch GitHub events: ${eventsRes.statusText}`);
        }
        const eventsData: GitHubEvent[] = await eventsRes.json();
        setEvents(eventsData);
        addAppLog('debug', `GitHub events fetched: ${eventsData.length}.`, 'GitHubProfileView');
        
        if (!reposRes.ok) {
            if (reposRes.status === 403 && reposRes.headers.get('X-RateLimit-Remaining') === '0') throw new Error('API rate limit exceeded (repos). Try again later.');
            throw new Error(`Failed to fetch GitHub repositories: ${reposRes.statusText}`);
        }
        const reposData: GitHubRepo[] = await reposRes.json();
        setRepos(reposData);
        addAppLog('debug', `GitHub repositories fetched: ${reposData.length}.`, 'GitHubProfileView');

      } catch (err: any) {
        setError(err.message);
        addAppLog('error', 'Error fetching GitHub data.', 'GitHubProfileView', { errorMessage: err.message });
        console.error("GitHubProfileView Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username, addAppLog]);

  const formatEventTitle = (event: GitHubEvent): React.ReactNode => {
    const repoLink = (
      <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--link-foreground)] hover:underline truncate" title={event.repo.name}>
        {event.repo.name}
      </a>
    );

    switch (event.type) {
      case 'PushEvent':
        return <>Pushed to {repoLink}</>;
      case 'CreateEvent':
        return <>Created {event.payload.ref_type || 'item'} {event.payload.ref ? <code className="text-xs bg-[var(--editor-tab-inactive-background)] px-1 py-0.5 rounded">{event.payload.ref}</code> : ''} in {repoLink}</>;
      case 'PullRequestEvent':
        return <>{event.payload.action || 'Interacted with'} PR <a href={event.payload.pull_request?.html_url} target="_blank" rel="noopener noreferrer" className="text-[var(--link-foreground)] hover:underline">#{event.payload.pull_request?.number}</a> in {repoLink}</>;
      case 'IssuesEvent':
        return <>{event.payload.action || 'Interacted with'} issue <a href={event.payload.issue?.html_url} target="_blank" rel="noopener noreferrer" className="text-[var(--link-foreground)] hover:underline">#{event.payload.issue?.number}</a> in {repoLink}</>;
      case 'ForkEvent':
        return <>Forked {repoLink} to <a href={event.payload.forkee?.html_url} target="_blank" rel="noopener noreferrer" className="text-[var(--link-foreground)] hover:underline">{event.payload.forkee?.full_name}</a></>;
      case 'WatchEvent': // Starred
        return <>Starred {repoLink}</>;
      case 'PublicEvent':
        return <>Made {repoLink} public</>;
      case 'ReleaseEvent':
        return <>Published release <a href={event.payload.release?.html_url} target="_blank" rel="noopener noreferrer" className="text-[var(--link-foreground)] hover:underline">{event.payload.release?.name || event.payload.release?.tag_name}</a> in {repoLink}</>;
      default:
        return <>Performed {event.type} on {repoLink}</>;
    }
  };
  
  const renderEventDetails = (event: GitHubEvent): React.ReactNode => {
    switch (event.type) {
        case 'PushEvent':
            const commits = event.payload.commits?.slice(0, 3) || []; // Show max 3 commits
            if (commits.length === 0) return <p className="text-xs text-[var(--text-muted)] pl-5">No commit details available.</p>;
            return (
                <ul className="pl-5 mt-1 space-y-0.5">
                {commits.map(commit => (
                    <li key={commit.sha} className="text-xs text-[var(--text-muted)] flex items-start">
                    <GitCommit size={12} className="mr-1.5 mt-0.5 text-[var(--text-accent)] flex-shrink-0" />
                    <span className="truncate" title={commit.message}>{commit.message.split('\n')[0]}</span>
                    {/* Optional: Link to commit */}
                    {/* <a href={`https://github.com/${event.repo.name}/commit/${commit.sha}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-[var(--link-foreground)] opacity-75 hover:opacity-100">({commit.sha.substring(0, 7)})</a> */}
                    </li>
                ))}
                {event.payload.commits && event.payload.commits.length > 3 && (
                    <li className="text-xs text-[var(--text-muted)] pl-4">...and {event.payload.commits.length - 3} more commits.</li>
                )}
                </ul>
            );
        case 'PullRequestEvent':
            if (event.payload.pull_request?.title) {
                 return <p className="text-xs text-[var(--text-muted)] pl-5 mt-0.5 flex items-start"><MessageSquare size={12} className="mr-1.5 mt-0.5 text-[var(--text-accent)] flex-shrink-0" /> <span className="truncate" title={event.payload.pull_request.title}>{event.payload.pull_request.title}</span></p>;
            }
            return null;
        case 'IssuesEvent':
            if (event.payload.issue?.title) {
                 return <p className="text-xs text-[var(--text-muted)] pl-5 mt-0.5 flex items-start"><MessageSquare size={12} className="mr-1.5 mt-0.5 text-[var(--text-accent)] flex-shrink-0" />  <span className="truncate" title={event.payload.issue.title}>{event.payload.issue.title}</span></p>;
            }
            return null;
        case 'ReleaseEvent':
             if (event.payload.release?.body) {
                 return <p className="text-xs text-[var(--text-muted)] pl-5 mt-0.5 line-clamp-2"><Tag size={12} className="mr-1.5 mt-0.5 text-[var(--text-accent)] flex-shrink-0 inline-block" /> {event.payload.release.body}</p>;
            }
            return null;
        default:
            return null;
    }
  };


  const featuredRepos = repos
    .filter(repo => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-[var(--editor-background)] text-[var(--editor-foreground)]">
        <Loader2 size={48} className="animate-spin text-[var(--text-accent)] mb-4" />
        <p className="text-lg text-[var(--text-muted)]">Loading GitHub Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-[var(--editor-background)] text-[var(--editor-foreground)]">
        <div className="mx-auto max-w-md p-4 rounded-md bg-[var(--notification-error-background)] text-[var(--notification-error-foreground)] border border-[var(--notification-error-border)]">
          <div className="flex items-center">
            <AlertTriangle size={24} className="mr-3 text-[var(--notification-error-icon)]" />
            <h2 className="text-xl font-semibold">Error Loading GitHub Data</h2>
          </div>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 bg-[var(--editor-background)] text-[var(--editor-foreground)] text-center">
        <p className="text-lg text-[var(--text-muted)]">GitHub profile data not available.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header Profile Section */}
        <header className="flex flex-col sm:flex-row items-start mb-6 md:mb-8">
          <img src={profile.avatar_url} alt={`${profile.name || profile.login}'s avatar`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mr-0 mb-4 sm:mr-6 sm:mb-0 border-4 border-[var(--focus-border)] shadow-lg" />
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--editor-tab-active-foreground)]">{profile.name || profile.login}</h1>
            <p className="text-lg sm:text-xl text-[var(--text-muted)] -mt-1">@{profile.login}</p>
            {profile.bio && <p className="text-sm mt-2 text-[var(--text-default)] max-w-xl">{profile.bio}</p>}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)] mt-3">
              {profile.company && <span className="flex items-center"><Briefcase size={14} className="mr-1.5" /> {profile.company}</span>}
              {profile.location && <span className="flex items-center"><MapPin size={14} className="mr-1.5" /> {profile.location}</span>}
              {profile.blog && (
                <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-[var(--link-foreground)] hover:underline">
                  <LinkIcon size={14} className="mr-1.5" /> {profile.blog.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm mt-3 text-[var(--text-default)]">
              <a href={`${profile.html_url}?tab=followers`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--link-foreground)] flex items-center">
                <Users size={16} className="mr-1 text-[var(--text-muted)]" /> <strong className="font-medium">{profile.followers}</strong>&nbsp;followers
              </a>
              <a href={`${profile.html_url}?tab=following`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--link-foreground)] flex items-center">
                <strong className="font-medium">{profile.following}</strong>&nbsp;following
              </a>
               <a href={`${profile.html_url}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--link-foreground)] flex items-center">
                <GitFork size={16} className="mr-1 text-[var(--text-muted)]" /> <strong className="font-medium">{profile.public_repos}</strong>&nbsp;repos
              </a>
            </div>
          </div>
        </header>

        {/* Featured Repositories */}
        {featuredRepos.length > 0 && (
          <section className="mb-6 md:mb-8">
            <h2 className="text-xl font-semibold mb-3 text-[var(--editor-tab-active-foreground)]">Featured Repositories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredRepos.map(repo => (
                <div key={repo.id} className="p-3 bg-[var(--sidebar-background)] border border-[var(--border-color)] rounded-md hover:border-[var(--focus-border)] transition-colors">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-md font-semibold text-[var(--link-foreground)] hover:underline block truncate">{repo.name}</a>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 mb-1.5 h-8 overflow-hidden line-clamp-2">{repo.description || 'No description available.'}</p>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span className="flex items-center"><Star size={12} className="mr-1 text-yellow-400" /> {repo.stargazers_count}</span>
                    {repo.language && <span className="px-1.5 py-0.5 bg-[var(--editor-tab-inactive-background)] rounded-sm">{repo.language}</span>}
                    <span className="flex items-center"><GitFork size={12} className="mr-1" /> {repo.forks_count}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-[var(--editor-tab-active-foreground)]">Recent Public Activity</h2>
          {events.length > 0 ? (
            <ul className="space-y-2.5">
              {events.slice(0,7).map(event => ( // Show top 7 recent events
                <li key={event.id} className="text-sm p-2.5 bg-[var(--sidebar-background)] border border-[var(--border-color)] rounded-md">
                  <div className="flex items-start text-[var(--text-default)] mb-0.5">
                    <Github size={16} className="mr-2.5 mt-0.5 text-[var(--text-accent)] flex-shrink-0" />
                    <div>{formatEventTitle(event)}</div>
                  </div>
                  {renderEventDetails(event)}
                  <div className="text-right text-[0.7rem] text-[var(--text-muted)] opacity-80 mt-1">
                    {new Date(event.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No recent public activity found.</p>
          )}
          <div className="mt-4 text-center">
            <a href={`${profile.html_url}?tab=overview`} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--link-foreground)] hover:underline inline-flex items-center">
              View Full Activity on GitHub <ExternalLink size={14} className="ml-1.5" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GitHubProfileView;
