--
-- PostgreSQL database cluster dump
--

\restrict KDHkEhAthvn88zFLfs5EXxMyceoJqm72fiv1qOZ9mVLV16UP7wRSw41wITvgoGs

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE anon;
ALTER ROLE anon WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticated;
ALTER ROLE authenticated WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticator;
ALTER ROLE authenticator WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE dashboard_user;
ALTER ROLE dashboard_user WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB NOLOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE pgbouncer;
ALTER ROLE pgbouncer WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE postgres;
ALTER ROLE postgres WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE service_role;
ALTER ROLE service_role WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_admin;
ALTER ROLE supabase_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE supabase_auth_admin;
ALTER ROLE supabase_auth_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_etl_admin;
ALTER ROLE supabase_etl_admin WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE supabase_read_only_user;
ALTER ROLE supabase_read_only_user WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_realtime_admin;
ALTER ROLE supabase_realtime_admin WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_replication_admin;
ALTER ROLE supabase_replication_admin WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE supabase_storage_admin;
ALTER ROLE supabase_storage_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;

--
-- User Configurations
--

--
-- User Config "anon"
--

ALTER ROLE anon SET statement_timeout TO '3s';

--
-- User Config "authenticated"
--

ALTER ROLE authenticated SET statement_timeout TO '8s';

--
-- User Config "authenticator"
--

ALTER ROLE authenticator SET session_preload_libraries TO 'safeupdate';
ALTER ROLE authenticator SET statement_timeout TO '8s';
ALTER ROLE authenticator SET lock_timeout TO '8s';

--
-- User Config "postgres"
--

ALTER ROLE postgres SET search_path TO E'\\$user', 'public', 'extensions';

--
-- User Config "supabase_admin"
--

ALTER ROLE supabase_admin SET search_path TO '$user', 'public', 'auth', 'extensions';
ALTER ROLE supabase_admin SET log_statement TO 'none';

--
-- User Config "supabase_auth_admin"
--

ALTER ROLE supabase_auth_admin SET search_path TO 'auth';
ALTER ROLE supabase_auth_admin SET idle_in_transaction_session_timeout TO '60000';
ALTER ROLE supabase_auth_admin SET log_statement TO 'none';

--
-- User Config "supabase_read_only_user"
--

ALTER ROLE supabase_read_only_user SET default_transaction_read_only TO 'on';

--
-- User Config "supabase_storage_admin"
--

ALTER ROLE supabase_storage_admin SET search_path TO 'storage';
ALTER ROLE supabase_storage_admin SET log_statement TO 'none';


--
-- Role memberships
--

GRANT anon TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT anon TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticated TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT authenticated TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticator TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticator TO supabase_storage_admin WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT pg_create_subscription TO postgres WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_monitor TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO supabase_etl_admin WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO supabase_read_only_user WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_signal_backend TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT service_role TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT service_role TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT supabase_realtime_admin TO postgres WITH INHERIT TRUE GRANTED BY supabase_admin;






\unrestrict KDHkEhAthvn88zFLfs5EXxMyceoJqm72fiv1qOZ9mVLV16UP7wRSw41wITvgoGs

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict MwI1CXI18txXq2zivRAQzuGvgKkuWGmZI7UXSQTJYqDeTemD4kBeGdNr1jtjcf9

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Debian 17.6-2.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict MwI1CXI18txXq2zivRAQzuGvgKkuWGmZI7UXSQTJYqDeTemD4kBeGdNr1jtjcf9

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict g81fpiYnaggWJBmodMZ6JfaY0AjWVFX1kWWTi8uCJOgA2mDVpK2jrDThcuSjHZ8

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Debian 17.6-2.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: user_quest_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_quest_status AS ENUM (
    'locked',
    'available',
    'completed'
);


ALTER TYPE public.user_quest_status OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: complete_quest(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.complete_quest(p_user_id uuid, p_quest_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  quest_record RECORD;
  profile_record RECORD;
  next_quest_id UUID;
  result JSONB;
BEGIN
  -- Get quest details
  SELECT * INTO quest_record FROM public.quests WHERE id = p_quest_id;
  
  -- Get current profile
  SELECT * INTO profile_record FROM public.profiles WHERE user_id = p_user_id;
  
  -- Update quest status
  UPDATE public.user_quests 
  SET status = 'completed', completed_at = now()
  WHERE user_id = p_user_id AND quest_id = p_quest_id AND status = 'available';
  
  -- Update profile stats
  UPDATE public.profiles SET
    xp_total = xp_total + quest_record.xp_total,
    stat_force = stat_force + quest_record.xp_force,
    stat_endurance = stat_endurance + quest_record.xp_endurance,
    stat_agilite = stat_agilite + quest_record.xp_agilite,
    stat_mental = stat_mental + quest_record.xp_mental,
    level = GREATEST(0, FLOOR((xp_total + quest_record.xp_total) / 200)),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Log XP audit
  INSERT INTO public.audit_xp (user_id, quest_id, delta_force, delta_endurance, delta_agilite, delta_mental, delta_total)
  VALUES (p_user_id, p_quest_id, quest_record.xp_force, quest_record.xp_endurance, quest_record.xp_agilite, quest_record.xp_mental, quest_record.xp_total);
  
  -- Unlock next quest
  SELECT q.id INTO next_quest_id
  FROM public.quests q
  WHERE q.campaign_id = quest_record.campaign_id 
    AND q.order_index = quest_record.order_index + 1;
  
  IF next_quest_id IS NOT NULL THEN
    UPDATE public.user_quests 
    SET status = 'available'
    WHERE user_id = p_user_id AND quest_id = next_quest_id AND status = 'locked';
  END IF;
  
  result := jsonb_build_object(
    'success', true,
    'xp_gained', quest_record.xp_total,
    'next_quest_unlocked', next_quest_id IS NOT NULL
  );
  
  RETURN result;
END;
$$;


ALTER FUNCTION public.complete_quest(p_user_id uuid, p_quest_id uuid) OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_emoji)
  VALUES (NEW.id, 'Nouvel Athlète', '🧑‍💻');
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: initialize_user_quests(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.initialize_user_quests(p_user_id uuid, p_campaign_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  quest_record RECORD;
  first_quest BOOLEAN := true;
BEGIN
  -- Vérifier si l'utilisateur a déjà des quêtes
  IF EXISTS (SELECT 1 FROM public.user_quests WHERE user_id = p_user_id LIMIT 1) THEN
    RETURN;
  END IF;

  FOR quest_record IN 
    SELECT id FROM public.quests 
    WHERE campaign_id = p_campaign_id 
    ORDER BY order_index
  LOOP
    INSERT INTO public.user_quests (user_id, quest_id, status)
    VALUES (
      p_user_id, 
      quest_record.id, 
      CASE WHEN first_quest THEN 'available' ELSE 'locked' END
    );
    first_quest := false;
  END LOOP;
END;
$$;


ALTER FUNCTION public.initialize_user_quests(p_user_id uuid, p_campaign_id uuid) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


ALTER FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_update_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_level_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.prefixes_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: audit_xp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_xp (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    quest_id uuid NOT NULL,
    delta_force integer DEFAULT 0,
    delta_endurance integer DEFAULT 0,
    delta_agilite integer DEFAULT 0,
    delta_mental integer DEFAULT 0,
    delta_total integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_xp OWNER TO postgres;

--
-- Name: badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    emoji text NOT NULL,
    condition_type text NOT NULL,
    condition_value integer NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT badges_condition_type_check CHECK ((condition_type = ANY (ARRAY['min_sessions'::text, 'first_superset'::text, 'beat_final_boss'::text])))
);


ALTER TABLE public.badges OWNER TO postgres;

--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    level_required text,
    equipment_tags text[],
    estimated_duration_weeks integer DEFAULT 4,
    is_published boolean DEFAULT true,
    CONSTRAINT campaigns_level_required_check CHECK ((level_required = ANY (ARRAY['BEGINNER'::text, 'INTERMEDIATE'::text, 'ADVANCED'::text, 'EXPERT'::text])))
);


ALTER TABLE public.campaigns OWNER TO postgres;

--
-- Name: exercise_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercise_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid,
    exercise_id uuid,
    set_number integer NOT NULL,
    reps_completed integer NOT NULL,
    weight_used numeric(5,2),
    completed_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.exercise_logs OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    display_name text DEFAULT 'Nouvel Athlète'::text,
    avatar_emoji text DEFAULT '🧑‍💻'::text,
    level integer DEFAULT 0,
    xp_total integer DEFAULT 0,
    stat_force integer DEFAULT 0,
    stat_endurance integer DEFAULT 0,
    stat_agilite integer DEFAULT 0,
    stat_mental integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: quest_exercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quest_exercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quest_id uuid NOT NULL,
    order_index integer NOT NULL,
    name text NOT NULL,
    target_reps integer DEFAULT 0,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sets_count integer DEFAULT 3,
    target_weight numeric(5,2),
    rest_seconds integer DEFAULT 60
);


ALTER TABLE public.quest_exercises OWNER TO postgres;

--
-- Name: quests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid NOT NULL,
    order_index integer NOT NULL,
    title text NOT NULL,
    description text,
    type text NOT NULL,
    xp_force integer DEFAULT 0,
    xp_endurance integer DEFAULT 0,
    xp_agilite integer DEFAULT 0,
    xp_mental integer DEFAULT 0,
    xp_total integer DEFAULT 0,
    workout_type text NOT NULL,
    work_seconds integer DEFAULT 0,
    rest_seconds integer DEFAULT 0,
    rounds_target integer DEFAULT 0,
    total_minutes integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    level_required text,
    equipment_tags text[],
    estimated_duration_minutes integer DEFAULT 30,
    is_one_shot boolean DEFAULT false,
    is_published boolean DEFAULT true,
    rest_time_seconds integer DEFAULT 60,
    sets_count integer DEFAULT 3,
    CONSTRAINT quests_level_required_check CHECK ((level_required = ANY (ARRAY['BEGINNER'::text, 'INTERMEDIATE'::text, 'ADVANCED'::text, 'EXPERT'::text]))),
    CONSTRAINT quests_type_check CHECK ((type = ANY (ARRAY['quete'::text, 'boss'::text]))),
    CONSTRAINT quests_workout_type_check CHECK ((workout_type = ANY (ARRAY['simple'::text, 'for_time'::text, 'tabata'::text, 'amrap'::text, 'emom'::text, 'strength'::text])))
);


ALTER TABLE public.quests OWNER TO postgres;

--
-- Name: session_rounds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session_rounds (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    round_no integer NOT NULL,
    duration_seconds integer DEFAULT 0,
    reps_total integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.session_rounds OWNER TO postgres;

--
-- Name: user_badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    badge_id uuid NOT NULL,
    unlocked_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_badges OWNER TO postgres;

--
-- Name: user_quests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_quests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    quest_id uuid NOT NULL,
    status text DEFAULT 'locked'::text NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_quests_status_check CHECK ((status = ANY (ARRAY['locked'::text, 'available'::text, 'completed'::text])))
);


ALTER TABLE public.user_quests OWNER TO postgres;

--
-- Name: workout_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workout_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    quest_id uuid NOT NULL,
    workout_type text NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone,
    rounds_completed integer DEFAULT 0,
    total_time_seconds integer DEFAULT 0,
    is_completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.workout_sessions OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text,
    created_by text,
    idempotency_key text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	5dab4676-a784-44cd-9a42-775202d98850	{"action":"user_confirmation_requested","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-09-03 00:28:06.160808+00	
00000000-0000-0000-0000-000000000000	48439d4b-50c3-4b40-99b7-1b3194bdf86e	{"action":"user_signedup","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-03 00:28:20.874672+00	
00000000-0000-0000-0000-000000000000	6867eb95-63dc-4aaa-b9f8-c9b18d0ca6a0	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-03 00:29:17.472077+00	
00000000-0000-0000-0000-000000000000	9d649e1b-6aa3-4c8e-8289-165b000d05cf	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-03 00:35:45.915438+00	
00000000-0000-0000-0000-000000000000	5fc22ab6-96f4-4305-acf7-9d6b957c48d1	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 11:32:49.104271+00	
00000000-0000-0000-0000-000000000000	ee81de4e-3c38-460b-af2d-36409e482541	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 11:32:49.113369+00	
00000000-0000-0000-0000-000000000000	a02a1521-0667-454b-80d1-8dadd222b910	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-03 12:19:26.424976+00	
00000000-0000-0000-0000-000000000000	f4725937-8c50-4414-a90a-07f4bf3184d2	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 13:19:57.993257+00	
00000000-0000-0000-0000-000000000000	8fbb520d-bf3e-4cf3-b478-59ec9001f87c	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 13:19:58.007357+00	
00000000-0000-0000-0000-000000000000	bbf1bf92-aee5-464d-ae19-dc6a8717d6da	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 13:26:17.109853+00	
00000000-0000-0000-0000-000000000000	7567dfc9-c5d8-44e8-aa00-0b2aa445d56e	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 13:26:17.120222+00	
00000000-0000-0000-0000-000000000000	bbc46046-b59a-4191-afe1-e2756598cf23	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 14:51:08.670348+00	
00000000-0000-0000-0000-000000000000	724fa217-1b72-474c-8ef7-c34a4aeab1e4	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 14:51:08.673685+00	
00000000-0000-0000-0000-000000000000	56cd0056-b599-458f-b6ee-a0037a178d66	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 16:21:14.783533+00	
00000000-0000-0000-0000-000000000000	85ed31ba-f107-4672-ae25-77751921cfad	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 16:21:14.798525+00	
00000000-0000-0000-0000-000000000000	45bb688f-ba2e-4bcf-ab60-3da405f75562	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 18:05:35.037901+00	
00000000-0000-0000-0000-000000000000	55295313-8d4a-4665-9fda-5745a1137fa9	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 18:05:35.045196+00	
00000000-0000-0000-0000-000000000000	23c0a118-8ba8-45c8-bf2a-b5959a45b242	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 19:20:12.847889+00	
00000000-0000-0000-0000-000000000000	3d4f8e67-3f29-4522-ac94-9af37c38571f	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 19:20:12.87558+00	
00000000-0000-0000-0000-000000000000	79b7e552-9973-4119-9427-f6565c8d3db6	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 20:17:21.678202+00	
00000000-0000-0000-0000-000000000000	4a430aec-7857-4731-bbdc-f4da39c289ef	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 20:17:21.693221+00	
00000000-0000-0000-0000-000000000000	3fe6cf51-efe5-4c59-926a-4a4546eb7b2d	{"action":"logout","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-03 20:30:33.452714+00	
00000000-0000-0000-0000-000000000000	6ca1681b-539b-4867-a6b0-52d97edc1bd4	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-03 20:30:38.683152+00	
00000000-0000-0000-0000-000000000000	e9ff2de7-a63e-4523-8d16-c6a1b9a14a99	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-03 21:06:36.952301+00	
00000000-0000-0000-0000-000000000000	1bacc0a3-17cd-455f-8083-ee6c51c384e4	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-03 21:18:10.909821+00	
00000000-0000-0000-0000-000000000000	42233a08-b1b8-401d-ac0f-0856e67b8421	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-03 21:18:13.224293+00	
00000000-0000-0000-0000-000000000000	eb6cb52f-427e-4506-8f5c-95b698087fd7	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 21:32:18.719818+00	
00000000-0000-0000-0000-000000000000	06a8bb57-b0df-4b6d-98a6-3b23be83d164	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 21:32:18.728149+00	
00000000-0000-0000-0000-000000000000	bd66f68c-559b-4d6c-bc96-32c1d3034511	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 23:24:07.912557+00	
00000000-0000-0000-0000-000000000000	c05101f9-69a8-420f-bc54-34e286f01530	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 23:24:07.934777+00	
00000000-0000-0000-0000-000000000000	fd3f8911-09ec-4caa-a0e1-9d5ff12bef26	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 00:02:52.279174+00	
00000000-0000-0000-0000-000000000000	628763c3-99c5-4d75-8efb-ddc930fcaf7a	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 00:02:52.301917+00	
00000000-0000-0000-0000-000000000000	353e835e-f180-4427-a128-2e56da30e7f0	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 00:24:52.636597+00	
00000000-0000-0000-0000-000000000000	aacc73e7-528e-447a-bdeb-921762205a3a	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 00:24:52.643205+00	
00000000-0000-0000-0000-000000000000	cbcf1284-2fab-45a5-8130-9f15c14fb659	{"action":"logout","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 00:58:33.819032+00	
00000000-0000-0000-0000-000000000000	6b47e3c7-033e-4d0a-9a13-3bfc4e499380	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 00:58:39.628938+00	
00000000-0000-0000-0000-000000000000	68de77a6-f2b5-47df-8d12-014d12acc49e	{"action":"logout","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 01:11:48.343479+00	
00000000-0000-0000-0000-000000000000	0e51459e-05c1-447c-a312-ddec1d2e1447	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 01:11:53.370079+00	
00000000-0000-0000-0000-000000000000	94d51564-f90f-4349-ba09-2030f6960e12	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 01:12:30.53571+00	
00000000-0000-0000-0000-000000000000	779382ab-2bf3-4857-b87d-3fd87a64df40	{"action":"logout","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 01:12:41.880078+00	
00000000-0000-0000-0000-000000000000	21da0273-cbe4-4e2e-b038-f51c7a744663	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 01:25:16.291373+00	
00000000-0000-0000-0000-000000000000	46dc936a-098f-4d3b-b63f-908c652decf2	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 01:46:37.336275+00	
00000000-0000-0000-0000-000000000000	7e22efc7-d18a-491f-b0b5-108c56e2c872	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 01:47:42.331428+00	
00000000-0000-0000-0000-000000000000	fee7f69c-4754-4b10-b93c-fa70bc091c36	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 09:28:14.625781+00	
00000000-0000-0000-0000-000000000000	1d052d84-db26-441c-830a-57195b9f3f62	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 09:28:14.63946+00	
00000000-0000-0000-0000-000000000000	276b237d-5cac-439d-8749-419ad55a27ae	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 09:33:21.114365+00	
00000000-0000-0000-0000-000000000000	025db3c9-81c3-4a67-a0c2-10949a4e0e02	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 09:33:21.121342+00	
00000000-0000-0000-0000-000000000000	13c126f4-e17c-4f54-8164-01a0c44d623e	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 09:51:30.256548+00	
00000000-0000-0000-0000-000000000000	9d059d3f-ffba-4ceb-b8ee-3a0c6d6bb7f4	{"action":"logout","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 10:00:32.856737+00	
00000000-0000-0000-0000-000000000000	9b868e2e-176b-4c6e-a342-9f2f5e14dd91	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 10:00:38.627106+00	
00000000-0000-0000-0000-000000000000	3dea8780-4217-4ccd-9484-10b9fc47ba3b	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 10:51:16.849406+00	
00000000-0000-0000-0000-000000000000	cb778de3-89a7-4bda-903c-99ae608e5fdb	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 10:58:59.972676+00	
00000000-0000-0000-0000-000000000000	3270d392-7465-4a81-b343-c88cf25713f8	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 10:58:59.983377+00	
00000000-0000-0000-0000-000000000000	2c24a0f2-54ac-4714-8ad7-4e549c1664d9	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 12:29:19.613533+00	
00000000-0000-0000-0000-000000000000	37bbb8ea-e3a0-4a95-9098-47eb8ed83f53	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 12:29:19.639651+00	
00000000-0000-0000-0000-000000000000	6667191a-4691-448c-af26-bdf0467697ad	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 13:28:10.983394+00	
00000000-0000-0000-0000-000000000000	e3ef82e8-807e-4553-a5ac-d2e2c60df9c9	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 13:28:11.001023+00	
00000000-0000-0000-0000-000000000000	d132d39f-1329-4be4-b3fe-137f49b83ba5	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 14:26:18.407089+00	
00000000-0000-0000-0000-000000000000	581b2f7d-0a2f-4a7b-94af-d6cc117715e4	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 14:26:18.427615+00	
00000000-0000-0000-0000-000000000000	9bbd59a3-8e5e-4895-a335-0f00a5529c4a	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 14:29:45.03078+00	
00000000-0000-0000-0000-000000000000	e314d30c-db6e-44a5-9ff3-b0a580518c22	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 15:24:45.75112+00	
00000000-0000-0000-0000-000000000000	9f106528-8010-4ccc-bb84-34b74605ffee	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 15:24:45.77278+00	
00000000-0000-0000-0000-000000000000	a96b65ce-415c-47fc-b1aa-4061737e4a08	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 15:27:22.269618+00	
00000000-0000-0000-0000-000000000000	22416e2f-d493-4adf-bc6a-dbdbb38f54a6	{"action":"logout","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 15:58:53.085922+00	
00000000-0000-0000-0000-000000000000	5f0d347f-d6b7-4427-a94e-50e888197550	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 15:58:59.220331+00	
00000000-0000-0000-0000-000000000000	a92d9bd9-8dd6-4169-a632-15ccde217444	{"action":"logout","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 16:06:28.745526+00	
00000000-0000-0000-0000-000000000000	1ee91203-d9b6-4fc5-8dca-39c6e746a6d1	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 16:06:34.801889+00	
00000000-0000-0000-0000-000000000000	bf3bb8de-0b71-469b-a8f1-31b28f2cfab4	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 17:04:46.663229+00	
00000000-0000-0000-0000-000000000000	77a0124d-90e9-4e62-8fa6-3fb4118b0862	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 17:04:46.672656+00	
00000000-0000-0000-0000-000000000000	0dd3627d-27fc-4cb0-ab59-7af7b8f1d46b	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 18:48:50.556571+00	
00000000-0000-0000-0000-000000000000	9b37fccd-9133-42cc-9e90-557b9c3d21d0	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 18:48:50.573871+00	
00000000-0000-0000-0000-000000000000	a5c11ea5-f148-44d1-865f-b94d107d5b81	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 19:48:03.291636+00	
00000000-0000-0000-0000-000000000000	6adaabdc-1008-414b-a9a1-7b422eb8fa01	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 19:48:03.302997+00	
00000000-0000-0000-0000-000000000000	bb395cac-833f-4722-b729-25638e8b93bb	{"action":"user_confirmation_requested","actor_id":"7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2","actor_username":"phiromyip@hotmail.fr","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-09-04 21:38:05.720904+00	
00000000-0000-0000-0000-000000000000	ed7cbcbd-b069-4440-a6a7-33c3604da436	{"action":"user_signedup","actor_id":"7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2","actor_username":"phiromyip@hotmail.fr","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-04 21:38:23.5091+00	
00000000-0000-0000-0000-000000000000	a4969ec3-a07c-4663-891f-1ef693e5c875	{"action":"login","actor_id":"7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2","actor_username":"phiromyip@hotmail.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 21:38:44.033392+00	
00000000-0000-0000-0000-000000000000	73c254a2-89ce-4a8b-88f2-7e4727ed1354	{"action":"logout","actor_id":"7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2","actor_username":"phiromyip@hotmail.fr","actor_via_sso":false,"log_type":"account"}	2025-09-04 21:42:10.738749+00	
00000000-0000-0000-0000-000000000000	94ea8429-1390-4be9-bebf-f79731eaa416	{"action":"login","actor_id":"7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2","actor_username":"phiromyip@hotmail.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 21:42:13.161606+00	
00000000-0000-0000-0000-000000000000	6b218584-38f1-4911-b2fa-d46ee84ee50b	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 22:14:20.9109+00	
00000000-0000-0000-0000-000000000000	832ee673-3d89-4c9e-8981-62ab6e32f9a1	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 22:14:20.925349+00	
00000000-0000-0000-0000-000000000000	684c74b6-03af-4ab7-a270-53a8aefafa6d	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 23:22:43.101102+00	
00000000-0000-0000-0000-000000000000	207b6c5c-87b5-4fae-b332-a5267fef6d04	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 00:07:49.960387+00	
00000000-0000-0000-0000-000000000000	7f049056-4dbf-48ea-b280-632b245e769d	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 00:07:49.979532+00	
00000000-0000-0000-0000-000000000000	5b7097e5-fe7e-48d4-a18c-9da8a3b0986d	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 00:25:18.914298+00	
00000000-0000-0000-0000-000000000000	d1f8858c-3707-4591-891f-775c898ba0ac	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 00:33:48.366863+00	
00000000-0000-0000-0000-000000000000	124c06a9-e415-4bd6-ad08-ad57a1d052fb	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 00:33:48.373914+00	
00000000-0000-0000-0000-000000000000	fe90671b-3f07-4392-aafc-a8383ae51ddd	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 09:14:26.098374+00	
00000000-0000-0000-0000-000000000000	1aa7f143-2acd-40e5-a81b-f361cc8ffe81	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 09:14:26.124974+00	
00000000-0000-0000-0000-000000000000	145bd0d7-d731-4b78-858e-7d2791a9fc76	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 09:15:11.582244+00	
00000000-0000-0000-0000-000000000000	d37183bf-a05f-4b4d-baa2-4e811a24d3b5	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 09:15:11.584498+00	
00000000-0000-0000-0000-000000000000	b7beb91f-e7e0-4b5d-a02e-c65bba7ca990	{"action":"token_refreshed","actor_id":"7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2","actor_username":"phiromyip@hotmail.fr","actor_via_sso":false,"log_type":"token"}	2025-09-05 09:36:23.975053+00	
00000000-0000-0000-0000-000000000000	58c18473-c214-4ec1-bb15-70871e998b54	{"action":"token_revoked","actor_id":"7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2","actor_username":"phiromyip@hotmail.fr","actor_via_sso":false,"log_type":"token"}	2025-09-05 09:36:23.985794+00	
00000000-0000-0000-0000-000000000000	a49c4ae9-eef9-4781-83fb-8ae60140e239	{"action":"logout","actor_id":"7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2","actor_username":"phiromyip@hotmail.fr","actor_via_sso":false,"log_type":"account"}	2025-09-05 09:36:27.03409+00	
00000000-0000-0000-0000-000000000000	0684cd50-bec6-489c-bf0f-c87be9093027	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 10:14:56.126225+00	
00000000-0000-0000-0000-000000000000	9e360bdd-3fee-47c8-b1b6-564e87a79492	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 10:14:56.151155+00	
00000000-0000-0000-0000-000000000000	f150c72e-08a8-42c6-b2dd-e503de2ddf6c	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 10:27:33.989051+00	
00000000-0000-0000-0000-000000000000	d9ddd9fd-8e4e-4b6b-983b-62d8b3b1a8e5	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 10:27:33.997116+00	
00000000-0000-0000-0000-000000000000	f8970d53-71b6-4652-8b60-8ba884fcda72	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 13:30:48.870525+00	
00000000-0000-0000-0000-000000000000	398d1b40-2aac-4aff-97cc-d0ceb7472bb4	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 13:30:48.887133+00	
00000000-0000-0000-0000-000000000000	23b062ec-0b19-42ce-a7b2-edb610159858	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 13:30:49.743437+00	
00000000-0000-0000-0000-000000000000	98e04ef4-4e9f-478e-b0fe-6a19cab14d38	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 13:30:49.750586+00	
00000000-0000-0000-0000-000000000000	e65d6e70-7397-465c-8633-d6e06833398f	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 14:05:53.126306+00	
00000000-0000-0000-0000-000000000000	67cc569e-e416-47b1-9da5-93f084535f26	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 14:05:53.13651+00	
00000000-0000-0000-0000-000000000000	2960a08f-4e3b-4238-9e80-f343d36f90c6	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-06 20:45:24.410336+00	
00000000-0000-0000-0000-000000000000	1d1261aa-4e6b-44d4-83d1-aa3be57d20fa	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-06 20:45:24.436096+00	
00000000-0000-0000-0000-000000000000	0bd27b1a-340f-46cd-b9b6-db671cef3e4c	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 10:24:31.408908+00	
00000000-0000-0000-0000-000000000000	45ce4f23-00cb-4d22-8da4-5acd214b215a	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 10:24:31.428901+00	
00000000-0000-0000-0000-000000000000	f6d20ee9-b484-46dc-afb1-81f89ede9939	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 10:39:36.363373+00	
00000000-0000-0000-0000-000000000000	1b4aec0f-0c12-435a-abdc-b39e926b73ab	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 10:39:36.367801+00	
00000000-0000-0000-0000-000000000000	63d2df82-1af7-4c25-8bbc-b33e6091185e	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-07 10:51:43.749841+00	
00000000-0000-0000-0000-000000000000	51f72561-4172-4eb9-9fbf-36ab29e0b6e7	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 11:33:48.367976+00	
00000000-0000-0000-0000-000000000000	cda897be-3f5b-4e7d-a235-0df5ee612a56	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 11:33:48.391095+00	
00000000-0000-0000-0000-000000000000	9fae5059-8f9e-4f00-8ff3-f578f39fa550	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 11:48:06.558732+00	
00000000-0000-0000-0000-000000000000	59c8ecc4-61a1-4fba-b364-ddd529684e9a	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 11:48:06.566562+00	
00000000-0000-0000-0000-000000000000	3ef3cf2b-df8d-4338-9348-3d3603151f7e	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 11:50:06.341305+00	
00000000-0000-0000-0000-000000000000	3145d141-f572-4bfe-91f9-a1ad7954d9ae	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 11:50:06.344806+00	
00000000-0000-0000-0000-000000000000	4eb9118c-1643-47d1-8f66-6670b61ab8f7	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 14:07:50.653727+00	
00000000-0000-0000-0000-000000000000	9071a7ee-2253-4fcf-9d1e-c3c3e595ffec	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 14:07:50.671844+00	
00000000-0000-0000-0000-000000000000	c67beca8-fdd4-4967-8540-9ff611047484	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 14:16:04.678643+00	
00000000-0000-0000-0000-000000000000	a6eaa9a5-a16f-4f62-8d08-8015550c10d3	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 14:16:04.689545+00	
00000000-0000-0000-0000-000000000000	713f777f-bd92-4e19-8e71-d7213412d0e6	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 14:16:04.91912+00	
00000000-0000-0000-0000-000000000000	5999aaf0-8047-4f07-aea8-b05bebb2b1ff	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 14:16:04.923409+00	
00000000-0000-0000-0000-000000000000	58c84d54-cc4f-47d5-a832-325891826d5c	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 15:45:35.07985+00	
00000000-0000-0000-0000-000000000000	ec0df698-705f-4214-ba36-fecca2cdfe29	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 15:45:35.099231+00	
00000000-0000-0000-0000-000000000000	1ca04a06-6dac-4960-b2d6-fb03a447f76d	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 16:44:51.919738+00	
00000000-0000-0000-0000-000000000000	4e24f458-33ec-414c-8e65-ac230ffabe59	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 16:44:51.933164+00	
00000000-0000-0000-0000-000000000000	5444f402-828d-4247-b998-e1646084dca4	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 16:46:31.846132+00	
00000000-0000-0000-0000-000000000000	33a1c375-7291-41eb-8de3-391494f38aac	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 16:46:31.847717+00	
00000000-0000-0000-0000-000000000000	278b347c-4fb9-473b-a469-a7912acc574e	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 17:58:22.17411+00	
00000000-0000-0000-0000-000000000000	c392c46c-9fba-4716-aba4-7269668e1e8b	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 17:58:22.202783+00	
00000000-0000-0000-0000-000000000000	430e1240-cc6a-4017-80bb-136b8f104b55	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 20:14:07.690012+00	
00000000-0000-0000-0000-000000000000	f48a30d8-5651-4625-aaa3-4bb9d90a42e9	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 20:14:07.708356+00	
00000000-0000-0000-0000-000000000000	4f70c26e-a197-4242-b43d-1933b618ac83	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 20:24:20.866951+00	
00000000-0000-0000-0000-000000000000	15dd4a3c-267d-48cb-98a2-5af03aa165de	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 20:24:20.889726+00	
00000000-0000-0000-0000-000000000000	30c65b39-bec9-4d6f-a0f9-a723e223646d	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 21:21:26.28081+00	
00000000-0000-0000-0000-000000000000	2b640542-d056-441c-9dd9-a8dacb82870f	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 21:21:26.298438+00	
00000000-0000-0000-0000-000000000000	e2af3aea-528e-43fa-9d50-dc928bfea287	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 22:37:49.832804+00	
00000000-0000-0000-0000-000000000000	28ac5442-498e-449e-85fb-1a50882fec75	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 22:37:49.849937+00	
00000000-0000-0000-0000-000000000000	634bfc9b-0546-4c8d-a8bb-d3ec0878232f	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 22:56:03.91831+00	
00000000-0000-0000-0000-000000000000	e8aaffa6-4a56-4475-8e57-abdf40fa148f	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 22:56:03.929703+00	
00000000-0000-0000-0000-000000000000	9d650ff3-10b3-4b66-8aa7-4c6eab39de6b	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 01:26:47.026352+00	
00000000-0000-0000-0000-000000000000	ae3214b5-3bf4-48d3-91a6-0283b7e6be70	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 01:26:47.043297+00	
00000000-0000-0000-0000-000000000000	a7bd784c-6147-4dc3-bb05-2f00d9eb5928	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 02:11:08.050907+00	
00000000-0000-0000-0000-000000000000	ffbfd2c8-5417-484b-bc1e-2dab607c1333	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 02:11:08.064066+00	
00000000-0000-0000-0000-000000000000	ccafc5a2-a44b-4d53-b99a-b637e96153e4	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 02:25:20.73957+00	
00000000-0000-0000-0000-000000000000	91d0243a-9af5-4fb6-b9fe-54761eaabdc0	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 02:25:20.747411+00	
00000000-0000-0000-0000-000000000000	145c80d2-5492-40a9-9969-d50713f18990	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 03:24:32.155274+00	
00000000-0000-0000-0000-000000000000	385d4a9e-337b-4ff8-acb4-2756c694e84d	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 03:24:32.163794+00	
00000000-0000-0000-0000-000000000000	51514f81-d164-4b5d-8eb5-b262648e4e27	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 10:29:07.235847+00	
00000000-0000-0000-0000-000000000000	2628cf18-f0b5-4a01-af80-5196a0327166	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 10:29:07.262914+00	
00000000-0000-0000-0000-000000000000	bbf530df-8eab-4b4a-a10d-afca3f3c7df7	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 10:29:29.415946+00	
00000000-0000-0000-0000-000000000000	befc8896-8ac0-43a8-9463-2c3d4a7436c2	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 10:29:29.418699+00	
00000000-0000-0000-0000-000000000000	327a7fbf-41df-415b-8d09-b5153fb4c9d8	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 11:36:15.142591+00	
00000000-0000-0000-0000-000000000000	13604688-c52f-4b4a-8812-61a3ea7e00fd	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 11:36:15.155988+00	
00000000-0000-0000-0000-000000000000	cc6d038a-b610-4055-b1f5-aae06b59165e	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 16:18:37.959757+00	
00000000-0000-0000-0000-000000000000	3fbed73c-534b-4792-b633-173db656c01f	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 16:25:59.137838+00	
00000000-0000-0000-0000-000000000000	e194e63c-8797-448f-ac20-f81ff23fc5b4	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 16:25:59.144671+00	
00000000-0000-0000-0000-000000000000	7a21c158-5708-4f0a-8e57-1851f3e1ae34	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 17:08:31.867634+00	
00000000-0000-0000-0000-000000000000	f5f787f0-fedf-489d-8545-606f3172bff0	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 17:26:47.792694+00	
00000000-0000-0000-0000-000000000000	744babcc-6a49-4cd9-9279-12ad09505f18	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 17:52:08.787879+00	
00000000-0000-0000-0000-000000000000	95f9d72e-d09d-4865-a1f3-617f07d68da3	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 17:53:25.499478+00	
00000000-0000-0000-0000-000000000000	04cecaa0-342a-44fb-8fa2-40a126ff8b3f	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 18:11:03.809279+00	
00000000-0000-0000-0000-000000000000	957b492a-746a-4997-9686-d380d9634f9a	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 18:11:03.823952+00	
00000000-0000-0000-0000-000000000000	6540bb0a-dd09-4968-ad2f-e46893f945ea	{"action":"user_confirmation_requested","actor_id":"cb55410e-aeef-46e9-ba41-52dfc34005e0","actor_username":"wilmed381409@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-09-08 19:21:12.655258+00	
00000000-0000-0000-0000-000000000000	279cc9dc-e38e-48f0-8b1f-6d384db5d20c	{"action":"user_signedup","actor_id":"cb55410e-aeef-46e9-ba41-52dfc34005e0","actor_username":"wilmed381409@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-08 19:21:55.246554+00	
00000000-0000-0000-0000-000000000000	ca3c5cbd-80e8-4788-91b1-5f4f9dc02b42	{"action":"login","actor_id":"cb55410e-aeef-46e9-ba41-52dfc34005e0","actor_username":"wilmed381409@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 19:22:46.517697+00	
00000000-0000-0000-0000-000000000000	7d20c9ee-5f7d-4a03-be5f-caf210de7a58	{"action":"logout","actor_id":"cb55410e-aeef-46e9-ba41-52dfc34005e0","actor_username":"wilmed381409@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-08 19:24:37.307786+00	
00000000-0000-0000-0000-000000000000	8f5afff7-005e-4fc3-be3d-2c6e9f6305f4	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 20:28:52.855679+00	
00000000-0000-0000-0000-000000000000	85ed3b57-8539-4182-bc61-fa761bcc9773	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 20:28:52.875285+00	
00000000-0000-0000-0000-000000000000	5cf87429-c259-480c-8534-d459291153e4	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 21:27:28.347148+00	
00000000-0000-0000-0000-000000000000	62f186f3-ae12-4981-a06a-cd4689ad3dc3	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 21:27:28.359759+00	
00000000-0000-0000-0000-000000000000	b5a3a438-7d2a-4150-883b-792ee2e45aa6	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 21:30:46.429365+00	
00000000-0000-0000-0000-000000000000	c74ee006-8fd0-4799-9a4e-3294db099a76	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 21:30:46.430953+00	
00000000-0000-0000-0000-000000000000	33dd483b-7641-4873-b35c-5428adf6bc63	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 21:58:31.387944+00	
00000000-0000-0000-0000-000000000000	a8d67dae-7321-4db5-a48e-cb8bb577ea7b	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 22:02:37.951379+00	
00000000-0000-0000-0000-000000000000	09699711-ed0b-4d98-8f59-e752a53e31bd	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-09 10:22:01.422867+00	
00000000-0000-0000-0000-000000000000	b793f230-4069-4a31-940d-b120da2d4d6b	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-09 10:22:01.451125+00	
00000000-0000-0000-0000-000000000000	92a3a355-deb5-4b2e-ba49-b22dd816f903	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-09 10:31:45.589955+00	
00000000-0000-0000-0000-000000000000	abd62d5f-a85d-4b1a-bc42-0701b97d6f4f	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-10 10:35:28.943709+00	
00000000-0000-0000-0000-000000000000	abaa1390-8946-4582-8568-8ee3938890ae	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-10 10:35:28.968415+00	
00000000-0000-0000-0000-000000000000	5e11d800-6600-4702-a9be-7e2d915adb0c	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-10 21:53:09.619119+00	
00000000-0000-0000-0000-000000000000	05fb26a1-0b61-4ff8-aa3c-8c02bbca7144	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-10 22:16:45.739445+00	
00000000-0000-0000-0000-000000000000	43112d5d-5580-4fa3-80cf-fd4afc5ea571	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-10 22:16:45.758256+00	
00000000-0000-0000-0000-000000000000	9bcc9fb3-e65a-4519-85fc-dbfc2b475b73	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-11 01:37:15.817458+00	
00000000-0000-0000-0000-000000000000	44572cb2-2380-4839-9c23-cc2298ce9535	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-11 01:37:15.846068+00	
00000000-0000-0000-0000-000000000000	96d8fe66-69d2-47d1-96e8-0a13268be4a7	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-11 11:59:09.249564+00	
00000000-0000-0000-0000-000000000000	48a9310e-7516-4067-a18c-a85bc93eeca1	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-11 11:59:09.273485+00	
00000000-0000-0000-0000-000000000000	1e1aa2f9-4360-410f-8091-e05d24bf659d	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-11 23:12:39.058155+00	
00000000-0000-0000-0000-000000000000	5236de4c-b488-47f8-b830-7a7780aea48f	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-11 23:12:39.073276+00	
00000000-0000-0000-0000-000000000000	e9f1a7e9-e881-4291-9c70-8355cc910dbe	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-11 23:14:24.409484+00	
00000000-0000-0000-0000-000000000000	5f0ca85a-018b-4f37-875a-7f17fa8c4fe7	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-11 23:14:24.419185+00	
00000000-0000-0000-0000-000000000000	2a7ecaf6-e7e6-4fc7-83a2-32146c7a64f6	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-12 21:36:12.193313+00	
00000000-0000-0000-0000-000000000000	6e8ad5c3-d36f-44c4-a4f4-3675a2b5d0f8	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-12 21:36:12.219357+00	
00000000-0000-0000-0000-000000000000	625d7bf6-24d2-438e-a063-b33163641a48	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-12 22:45:20.904611+00	
00000000-0000-0000-0000-000000000000	81691ef2-3133-4e8e-80be-14e57fcad849	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-12 22:45:20.916151+00	
00000000-0000-0000-0000-000000000000	914fd8f7-882e-4e01-aa79-a8661d5c304f	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 09:07:10.303036+00	
00000000-0000-0000-0000-000000000000	b1070f68-661a-4c54-ad14-d66dc831ea2b	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 09:07:10.327074+00	
00000000-0000-0000-0000-000000000000	8690aa2a-5dc9-466e-874c-58f7975e05f2	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 09:07:25.041788+00	
00000000-0000-0000-0000-000000000000	0bffe454-cbed-4a09-8ca6-b428da544325	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 09:07:25.044393+00	
00000000-0000-0000-0000-000000000000	5f596417-4765-425b-9470-55d1835bb469	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 20:50:01.33824+00	
00000000-0000-0000-0000-000000000000	7028b35f-5422-427c-8599-a3742b9626a6	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 20:50:01.366916+00	
00000000-0000-0000-0000-000000000000	27076bc6-a54c-4fe7-a975-d4c2df0f37b9	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 20:53:05.718469+00	
00000000-0000-0000-0000-000000000000	df228899-7f81-4c98-9601-30ade154b3f4	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-17 11:46:40.213815+00	
00000000-0000-0000-0000-000000000000	5498f184-e6dc-4753-a785-d3a449191f17	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-17 11:46:40.24228+00	
00000000-0000-0000-0000-000000000000	faf92a1a-714c-4baa-af9c-ca9d9a56b4bb	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-22 13:43:58.716729+00	
00000000-0000-0000-0000-000000000000	167e7d29-0275-4913-945c-44247b953e76	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-22 13:43:58.74996+00	
00000000-0000-0000-0000-000000000000	f45501df-ac3e-4f25-a4e6-f70882c95ea1	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-23 09:08:27.162728+00	
00000000-0000-0000-0000-000000000000	ca67078e-a060-427a-b785-a7cdf5f48a09	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-23 09:08:27.181768+00	
00000000-0000-0000-0000-000000000000	d1a40efb-dab0-4d67-a39a-d507c0b92b2d	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-23 12:38:17.60557+00	
00000000-0000-0000-0000-000000000000	335265a5-3082-4c5d-ad81-2c58f3f3970f	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-23 12:38:17.621505+00	
00000000-0000-0000-0000-000000000000	ab865393-9aed-4f81-b1be-24fd9cacbd01	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-23 15:40:38.414453+00	
00000000-0000-0000-0000-000000000000	45df0dd0-f966-4f6d-aede-b1d774cd9327	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-23 15:40:38.441514+00	
00000000-0000-0000-0000-000000000000	57a9a446-8aa8-4538-9ebc-4dbc4b86a071	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-24 11:17:26.941419+00	
00000000-0000-0000-0000-000000000000	f497afa2-9e2b-4d0d-a294-b4a7bb850565	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-24 11:17:26.965301+00	
00000000-0000-0000-0000-000000000000	2b2ab8e7-70d9-4ab0-95d7-ebbb06095428	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-26 20:13:19.229464+00	
00000000-0000-0000-0000-000000000000	6993d76e-f950-4234-9c82-cac7ec3610b3	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-26 20:13:19.261072+00	
00000000-0000-0000-0000-000000000000	878129e0-dca2-4db6-821a-0defd64ae8f7	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-29 12:12:29.503597+00	
00000000-0000-0000-0000-000000000000	866b2d87-d7c1-47c8-abd8-fdf2dda4f317	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-29 12:12:29.521021+00	
00000000-0000-0000-0000-000000000000	d3da9a41-4fc7-4bc9-9cca-f8387512e495	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-30 13:23:10.687414+00	
00000000-0000-0000-0000-000000000000	aa1ff631-ca35-4001-beab-7e63bb6a2444	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-30 13:23:10.716004+00	
00000000-0000-0000-0000-000000000000	291c96ac-2f4f-4710-8110-b506d0f00fee	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-08 07:32:30.438882+00	
00000000-0000-0000-0000-000000000000	7eb259cd-719e-4cfb-a08a-4e33f1be8430	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-08 07:32:30.468972+00	
00000000-0000-0000-0000-000000000000	b5b6d497-796c-4f2f-a1e3-b159d1817ae5	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-08 11:20:40.069835+00	
00000000-0000-0000-0000-000000000000	0ce8f451-4b9c-4514-933b-b2726cd16b1a	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-08 11:20:40.102713+00	
00000000-0000-0000-0000-000000000000	15e210c0-25a6-4e1f-afb6-f85e0b21baf4	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 11:35:18.036104+00	
00000000-0000-0000-0000-000000000000	482d68e1-e262-4320-9968-cab66d71e008	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 11:35:18.052912+00	
00000000-0000-0000-0000-000000000000	f7016cf3-dbe1-43db-86f3-a6c0729be5d8	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 11:41:45.996241+00	
00000000-0000-0000-0000-000000000000	730fe557-3402-42a4-9220-32e2392bcbd5	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 11:41:45.999511+00	
00000000-0000-0000-0000-000000000000	3e33aec1-8a03-4378-8134-cb893e6568c0	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-09 11:50:43.058112+00	
00000000-0000-0000-0000-000000000000	b789e60f-cf72-4855-95c7-e633b51cf61d	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 17:32:02.297636+00	
00000000-0000-0000-0000-000000000000	a8d2ac4e-9cad-4335-aebb-ebae3977c3af	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 17:32:02.330889+00	
00000000-0000-0000-0000-000000000000	9783c6fa-2e7b-49fd-b8ca-3eb8cd5082f3	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 19:21:25.917322+00	
00000000-0000-0000-0000-000000000000	d9f00ea8-4036-455b-90b8-aaeda18e6eee	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 19:21:25.940312+00	
00000000-0000-0000-0000-000000000000	0013601b-6101-4b7b-9f7f-9020b48494b0	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 21:45:48.551596+00	
00000000-0000-0000-0000-000000000000	3566fa72-76d9-4633-8dfb-7df6c5a8fc3c	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 21:45:48.56976+00	
00000000-0000-0000-0000-000000000000	19c4e5b3-1e6d-4727-b700-488c54f2afe4	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 21:52:37.88867+00	
00000000-0000-0000-0000-000000000000	944c180d-158c-4692-af3c-03e65efbbedb	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 21:52:37.891793+00	
00000000-0000-0000-0000-000000000000	089af82d-0f9b-4516-842e-e658d82e04ef	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 23:03:00.080252+00	
00000000-0000-0000-0000-000000000000	751aff0f-ec81-4b51-a3b8-d27bc809addc	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-09 23:03:00.102892+00	
00000000-0000-0000-0000-000000000000	5b923b6e-8f2c-46a2-82ba-099ceb5f8f95	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 10:17:43.516145+00	
00000000-0000-0000-0000-000000000000	cdc20932-4f9c-46d3-aff8-04c58243f0bf	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 10:17:43.543921+00	
00000000-0000-0000-0000-000000000000	61644d30-ef8b-43a5-81cf-cd44e332eea2	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 10:18:22.20708+00	
00000000-0000-0000-0000-000000000000	adfe2524-8e22-4b2f-91ae-faad18668758	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 10:18:22.208775+00	
00000000-0000-0000-0000-000000000000	742a749f-9ce7-4f73-9670-e444d1543a04	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 10:42:16.965753+00	
00000000-0000-0000-0000-000000000000	2c908331-38c9-4b16-9495-335bf589deb2	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 10:42:16.982872+00	
00000000-0000-0000-0000-000000000000	d32c3cde-a381-4d3a-b500-facd65a71423	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 11:59:41.784168+00	
00000000-0000-0000-0000-000000000000	bb1f217a-a3be-4ad2-977d-fe03b2eb5214	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 11:59:41.80306+00	
00000000-0000-0000-0000-000000000000	80557b00-afdd-42e4-b882-7d9f9f83d06c	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 11:59:43.394283+00	
00000000-0000-0000-0000-000000000000	cbc5b0ff-b71a-4a72-bb44-64c9c1573c80	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 11:59:43.395504+00	
00000000-0000-0000-0000-000000000000	0399bc3b-602d-453b-9dc8-e2d454b34755	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 16:32:10.976146+00	
00000000-0000-0000-0000-000000000000	31354159-46da-45e4-8a9c-a1ecffb7d4b1	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 16:32:10.997802+00	
00000000-0000-0000-0000-000000000000	9b1011a3-057f-4bd6-a6e3-8efd2ef3b2bc	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 17:30:26.019124+00	
00000000-0000-0000-0000-000000000000	9ec27726-b7ca-41b0-9fef-83f81ad55701	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 17:30:26.030393+00	
00000000-0000-0000-0000-000000000000	e431f7e9-64ac-4376-bf14-c1cc11dc8a86	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 18:24:42.527403+00	
00000000-0000-0000-0000-000000000000	6eeaf487-85a7-44b0-84d4-3723ae12081a	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 18:24:42.538153+00	
00000000-0000-0000-0000-000000000000	187a4f88-ade7-41e1-9132-82320816a463	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 18:58:31.638542+00	
00000000-0000-0000-0000-000000000000	7431b419-a9d3-4671-82dd-8c4c1e976ec2	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 18:58:31.656329+00	
00000000-0000-0000-0000-000000000000	ea4cff3b-a699-4f62-b628-f1b1e4a34858	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 20:55:57.240993+00	
00000000-0000-0000-0000-000000000000	a1135dab-6670-489b-95e3-57ce1f2c59f9	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 20:55:57.260881+00	
00000000-0000-0000-0000-000000000000	c746697e-9be5-416e-9372-366712dfa9bd	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 23:24:36.623412+00	
00000000-0000-0000-0000-000000000000	8f4ac517-6048-4f5d-980f-43e53aa0e97a	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 23:24:36.642857+00	
00000000-0000-0000-0000-000000000000	89143bc4-9de5-4dff-84f7-2536e506a676	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 23:33:28.359248+00	
00000000-0000-0000-0000-000000000000	dcc03614-973d-453c-8510-25ec3b2e1e7a	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-10 23:33:28.363335+00	
00000000-0000-0000-0000-000000000000	7f68c5ce-945a-426b-898c-ce042c75e009	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 00:31:38.87006+00	
00000000-0000-0000-0000-000000000000	7f2bb532-c84d-444a-a9f2-cd9251030e46	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 00:31:38.886305+00	
00000000-0000-0000-0000-000000000000	d3505bb6-e0b3-4986-82a4-9a23b85c36fd	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 00:43:45.442147+00	
00000000-0000-0000-0000-000000000000	772a34b5-2d2f-4ae8-bf4d-22cbba25f022	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 00:43:45.453045+00	
00000000-0000-0000-0000-000000000000	9bf31ea2-95f3-43d0-9a1c-c3fad1598e24	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 02:32:06.689723+00	
00000000-0000-0000-0000-000000000000	2a6e6a85-d7a8-4e93-9d58-ae0eca0fa704	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 02:32:06.711551+00	
00000000-0000-0000-0000-000000000000	58a25a2e-57bc-4fee-9b50-797035ea0de8	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 02:53:47.617689+00	
00000000-0000-0000-0000-000000000000	486a44b7-c59f-464f-bc1e-d9f45be2d292	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 02:53:47.624031+00	
00000000-0000-0000-0000-000000000000	63a15059-8c02-412a-965d-3631b414ac35	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 03:52:26.21732+00	
00000000-0000-0000-0000-000000000000	9baa4cea-2c1a-4ef9-b8c7-9be698d8c965	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 03:52:26.238459+00	
00000000-0000-0000-0000-000000000000	96fedb09-73e7-44d9-ab2f-a38dde2fb3e5	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 10:13:08.466816+00	
00000000-0000-0000-0000-000000000000	a9af8b14-7431-4d70-a383-0a05255cfb6d	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 10:13:08.48833+00	
00000000-0000-0000-0000-000000000000	383d0028-1845-45d1-a354-99b5f56e3ddc	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 15:36:29.557993+00	
00000000-0000-0000-0000-000000000000	e19622ca-988d-4ec2-addd-505749f6320b	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 15:36:29.580439+00	
00000000-0000-0000-0000-000000000000	c293ff1e-f939-4182-b825-6c0c71fd8ce3	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 16:34:32.621998+00	
00000000-0000-0000-0000-000000000000	c31b68b5-251e-4ae9-971f-7e3fa9a4d7ef	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 16:34:32.641445+00	
00000000-0000-0000-0000-000000000000	f33191fa-3092-4662-9fb6-f20b319803d4	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 16:52:06.868672+00	
00000000-0000-0000-0000-000000000000	dcf9ee7c-fe10-4670-81f3-509426db7368	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 16:52:06.882998+00	
00000000-0000-0000-0000-000000000000	19ad8c0c-af14-47f0-80a0-5d5da95c9bb0	{"action":"login","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 16:53:23.200225+00	
00000000-0000-0000-0000-000000000000	3712dab3-1546-4f21-bdc7-5224516e1f87	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 17:58:06.522988+00	
00000000-0000-0000-0000-000000000000	b4d4d029-0905-478e-9135-5a5e74af0cc0	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 17:58:06.538852+00	
00000000-0000-0000-0000-000000000000	8f737ff3-2ece-45b2-a342-1560581c9b38	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 17:58:06.594354+00	
00000000-0000-0000-0000-000000000000	01517a5b-0e35-41d5-9041-f51159e1bd3b	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 19:20:18.523645+00	
00000000-0000-0000-0000-000000000000	a4de3ea1-1fa4-474d-9d37-cd5946b19a61	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 19:20:18.545148+00	
00000000-0000-0000-0000-000000000000	1f9437b3-5b52-4857-ab51-3c41d8929ac8	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 22:05:32.871593+00	
00000000-0000-0000-0000-000000000000	b42486f8-de51-4386-b5a7-83e5e8ba1261	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 22:05:32.897535+00	
00000000-0000-0000-0000-000000000000	f34e88bd-0af2-48bf-89ce-00cc1acd2b4e	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 23:04:07.101221+00	
00000000-0000-0000-0000-000000000000	839ba5f7-a02b-431b-ad90-efc587d867cd	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 23:04:07.117411+00	
00000000-0000-0000-0000-000000000000	ba7a28c8-2b7d-476d-aff7-7c272e4d8bf2	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 00:02:16.860017+00	
00000000-0000-0000-0000-000000000000	d66195e4-6f82-4937-a61e-8fa5904e7100	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 00:02:16.885243+00	
00000000-0000-0000-0000-000000000000	631ea611-0e65-475b-b469-f430eb75920e	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 02:37:47.235634+00	
00000000-0000-0000-0000-000000000000	ae74d3df-6515-4c74-92ef-7b85e53f5379	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 02:37:47.260127+00	
00000000-0000-0000-0000-000000000000	83d25079-0fcf-426e-b1c4-dcda71549764	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 12:21:02.758056+00	
00000000-0000-0000-0000-000000000000	d4787037-7f37-4d59-867b-12b54531787e	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 12:21:02.773483+00	
00000000-0000-0000-0000-000000000000	00779d73-f96a-4be9-a760-83c3377f5c91	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 13:23:07.915634+00	
00000000-0000-0000-0000-000000000000	6c41a297-cd37-4086-8a44-a2afbef399bc	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 13:23:07.93056+00	
00000000-0000-0000-0000-000000000000	ba6c7705-7849-45d0-8c47-2a9399e8ee0d	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 15:25:18.356511+00	
00000000-0000-0000-0000-000000000000	09883b9d-e7ca-4c47-b35b-47a83a18de69	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 15:25:18.384198+00	
00000000-0000-0000-0000-000000000000	633be6f3-6f0d-416e-a0f4-c6673037c82d	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 17:24:00.980205+00	
00000000-0000-0000-0000-000000000000	fa99075d-e45b-476c-9e76-8ef1e4c00ee5	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 17:24:00.992292+00	
00000000-0000-0000-0000-000000000000	f09c561a-020e-4032-b9c1-27c5e7570eb0	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 19:20:36.113424+00	
00000000-0000-0000-0000-000000000000	b2df81be-4dc7-474b-b6c8-1fdfd13bc18d	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 19:20:36.140935+00	
00000000-0000-0000-0000-000000000000	e58e2a06-4257-4371-ab95-3d34a63a803b	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 21:43:57.368311+00	
00000000-0000-0000-0000-000000000000	2d14b10b-f54c-44c7-bcc1-34e9fed97bb3	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 21:43:57.387067+00	
00000000-0000-0000-0000-000000000000	091fe29d-f111-4430-a97d-8daa8339e219	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 22:46:21.984889+00	
00000000-0000-0000-0000-000000000000	3aaa9d12-6bc1-4bac-a3ce-959ca50e15e0	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 22:46:21.99682+00	
00000000-0000-0000-0000-000000000000	0635b2f8-898b-4376-91f5-70d5c79e778d	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 23:44:33.535135+00	
00000000-0000-0000-0000-000000000000	5b79738c-81e1-4776-8f57-671768fc8322	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 23:44:33.569347+00	
00000000-0000-0000-0000-000000000000	fa16bce8-936a-4d38-b457-96cce99b3137	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 01:03:46.799853+00	
00000000-0000-0000-0000-000000000000	1dc87d41-7410-4ce7-8956-9b30938487d4	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 01:03:46.828387+00	
00000000-0000-0000-0000-000000000000	74ee9534-8b4c-48a1-b5a2-855d00e3265a	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 08:04:05.979576+00	
00000000-0000-0000-0000-000000000000	c79e41ec-140f-430f-ae98-adb8cd470f81	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 08:04:06.007072+00	
00000000-0000-0000-0000-000000000000	26f74103-b290-47ae-ac60-6d283cbe26ec	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 10:25:15.553975+00	
00000000-0000-0000-0000-000000000000	1af92e32-665a-4807-8718-5450ac17d641	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 10:25:15.586227+00	
00000000-0000-0000-0000-000000000000	6f7bb878-9eb3-48b4-a0b2-1f8db16baefd	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 11:45:29.539145+00	
00000000-0000-0000-0000-000000000000	be99a878-59fd-49a3-9783-19f252c739a5	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 11:45:29.553814+00	
00000000-0000-0000-0000-000000000000	50896a94-fcbb-46a2-9ec5-214014f47926	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 13:49:14.028188+00	
00000000-0000-0000-0000-000000000000	d2100727-88d3-4a12-9104-d5b3bf12641d	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 13:49:14.051848+00	
00000000-0000-0000-0000-000000000000	0e57ddad-bc39-4085-8256-1c0fa62ff2fe	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 14:48:15.169333+00	
00000000-0000-0000-0000-000000000000	22fbd234-3a4f-446c-bd53-8d4e2cabd990	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 14:48:15.186073+00	
00000000-0000-0000-0000-000000000000	1f503a43-1f96-4f3b-a30c-f15bbf589654	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 19:50:14.973915+00	
00000000-0000-0000-0000-000000000000	5e942717-b6d2-4a75-b8e6-fbdf06916e24	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-13 19:50:14.996777+00	
00000000-0000-0000-0000-000000000000	98d47c35-44a7-4a0d-833b-b29cf5a67fd8	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 08:44:20.440669+00	
00000000-0000-0000-0000-000000000000	2c740e1b-5389-4b14-b125-80a17ea22e59	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 08:44:20.477808+00	
00000000-0000-0000-0000-000000000000	71d39197-041d-42e8-a8f6-026330fe5b22	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 09:08:41.299121+00	
00000000-0000-0000-0000-000000000000	24bbac6d-602e-458c-bbc1-e07fddb69be5	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 09:08:41.309274+00	
00000000-0000-0000-0000-000000000000	6bd04754-aaa7-4db2-9580-4bfbd797b730	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 12:26:08.368004+00	
00000000-0000-0000-0000-000000000000	16f6fc4e-316e-44c4-b096-254503a9b6aa	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 12:26:08.391616+00	
00000000-0000-0000-0000-000000000000	e72e6f52-bc5b-4fcf-a454-3983baea3951	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 11:09:42.546602+00	
00000000-0000-0000-0000-000000000000	10b09c27-af9e-4baf-ae74-c09ec9666d37	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 11:09:42.56583+00	
00000000-0000-0000-0000-000000000000	84dbc029-b2aa-4bca-a328-31ed3d13dcaf	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 11:09:42.64104+00	
00000000-0000-0000-0000-000000000000	7fded88e-e400-427f-b7e7-dd7835b42ddc	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 11:09:48.392386+00	
00000000-0000-0000-0000-000000000000	1b79588d-b146-49cb-8d9c-f4b180a8630c	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 11:09:48.393044+00	
00000000-0000-0000-0000-000000000000	ab674b5e-8f84-4126-a0b9-e027f02c956c	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 15:52:08.401365+00	
00000000-0000-0000-0000-000000000000	9421bbfd-7311-4f2f-bb5f-bb23fa8f5537	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 15:52:08.423963+00	
00000000-0000-0000-0000-000000000000	4062c838-a74e-4dfc-88e0-20566528c2b3	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 16:03:01.515206+00	
00000000-0000-0000-0000-000000000000	790b8588-6fa6-47af-b129-470b4d55724f	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-15 16:03:01.520686+00	
00000000-0000-0000-0000-000000000000	03926bb3-1b34-4779-8324-966ada330ee2	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 08:16:16.004193+00	
00000000-0000-0000-0000-000000000000	a9c4e723-a8a9-4352-b1ba-2f6d4c0f5a11	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 08:16:16.034618+00	
00000000-0000-0000-0000-000000000000	d2b80e9b-5bf6-4da7-95d2-1f902ac8304f	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 09:52:24.895024+00	
00000000-0000-0000-0000-000000000000	5e02638d-9c9a-4379-b96e-281ad9ef0f4c	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-16 09:52:24.908738+00	
00000000-0000-0000-0000-000000000000	574020b2-5ae1-4870-b2cc-2490119d0253	{"action":"token_refreshed","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-17 10:43:24.47559+00	
00000000-0000-0000-0000-000000000000	e56d3940-53d1-4315-a14d-d64c5b062887	{"action":"token_revoked","actor_id":"03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b","actor_username":"mjeremy14@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-17 10:43:24.504634+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	{"sub": "03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b", "email": "mjeremy14@gmail.com", "email_verified": true, "phone_verified": false}	email	2025-09-03 00:28:06.156414+00	2025-09-03 00:28:06.156465+00	2025-09-03 00:28:06.156465+00	cfb47236-ae97-47d7-baa9-c8953221cb51
7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2	7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2	{"sub": "7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2", "email": "phiromyip@hotmail.fr", "email_verified": true, "phone_verified": false}	email	2025-09-04 21:38:05.691562+00	2025-09-04 21:38:05.692364+00	2025-09-04 21:38:05.692364+00	228fc1e8-4a47-4142-9f67-143da090ef3d
cb55410e-aeef-46e9-ba41-52dfc34005e0	cb55410e-aeef-46e9-ba41-52dfc34005e0	{"sub": "cb55410e-aeef-46e9-ba41-52dfc34005e0", "email": "wilmed381409@gmail.com", "email_verified": true, "phone_verified": false}	email	2025-09-08 19:21:12.637921+00	2025-09-08 19:21:12.638439+00	2025-09-08 19:21:12.638439+00	ee8469dd-73e8-436d-81a6-493996ac3693
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
f8194e28-36b5-4166-9e8f-422d3e3a4ea6	2025-09-04 16:06:34.821691+00	2025-09-04 16:06:34.821691+00	password	76f1b9f0-4359-4883-b23b-321350d49e36
d473b426-fec4-4eb3-b508-cd67fbb3c4cb	2025-09-04 23:22:43.144304+00	2025-09-04 23:22:43.144304+00	password	b9ef1f3f-c836-4227-8ab3-1928639f95ff
c5c9f0b0-7edd-478e-a8b0-b623fca931ac	2025-09-05 00:25:18.959694+00	2025-09-05 00:25:18.959694+00	password	a21de52e-3b9d-44ed-bdae-76d69c1793e2
f49886a7-5f8c-48fd-8c08-2b396ec3341f	2025-09-07 10:51:43.774078+00	2025-09-07 10:51:43.774078+00	password	c69a325f-5334-43cc-89f2-f135ce95bf9b
538f1ea3-5e61-4e60-9278-95987d2729fa	2025-09-08 16:18:38.084304+00	2025-09-08 16:18:38.084304+00	password	1be4ad5f-be80-4d73-a1db-08ef771242d9
0da73935-9126-41e2-a354-e577b631827e	2025-09-08 17:08:31.932522+00	2025-09-08 17:08:31.932522+00	password	11f889cc-fcd1-421b-b21a-2a06af91acf7
85b59aa2-ce8a-47b1-ae7c-6fcc69939760	2025-09-08 17:26:47.827014+00	2025-09-08 17:26:47.827014+00	password	38a8e545-43fa-4e87-afa2-8242769c51bf
c8e57bc1-01ed-46bd-80bb-fe364d4e9ff7	2025-09-08 17:52:08.844618+00	2025-09-08 17:52:08.844618+00	password	4ea34fd4-fcac-46f7-97ad-e1dca26f0556
e54dd998-0f2a-4348-b0bb-be2d62c531c8	2025-09-08 17:53:25.560148+00	2025-09-08 17:53:25.560148+00	password	7743ecab-a418-4d3c-9629-c72b69d25649
36979f83-31f4-4d7b-aed4-9f9a9f809e0c	2025-09-08 21:58:31.417485+00	2025-09-08 21:58:31.417485+00	password	7ee149eb-0f7f-44bd-8488-57f202e2b6c6
762b8f3a-ef16-4ab1-a864-da12c58876b9	2025-09-08 22:02:37.959782+00	2025-09-08 22:02:37.959782+00	password	03c950b2-e792-465c-b144-ed6d574b1f9a
d6774026-556f-455e-acfa-33d6e1b3537d	2025-09-09 10:31:45.621972+00	2025-09-09 10:31:45.621972+00	password	6893ee28-d822-4389-bb58-e55ce362f58a
b7fd6f74-b274-438e-987d-4b2a8e6f2de0	2025-09-10 21:53:09.713434+00	2025-09-10 21:53:09.713434+00	password	7f038d99-84c1-4557-ac22-9c45cdd3bf88
32d68d60-5d8a-46ed-a874-ec2fb6e2506a	2025-09-15 20:53:05.743097+00	2025-09-15 20:53:05.743097+00	password	c873dfb1-4984-476c-861b-5d485f2a71fe
fd61d259-79fd-4452-ad8c-8da18c286a66	2025-10-09 11:50:43.088733+00	2025-10-09 11:50:43.088733+00	password	09989fe5-41f8-44bb-a3de-c4ac3e8b504e
f2d23058-e7cb-47b1-a5bd-8785d91afc15	2025-10-11 16:53:23.224013+00	2025-10-11 16:53:23.224013+00	password	1f458590-acc9-4561-bce8-c697b07d7592
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	40	z4yg7quulzkj	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-04 16:06:34.813528+00	2025-09-04 17:04:46.674779+00	\N	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	115	2sjxs6dyqkto	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-09-17 11:46:40.262678+00	2025-09-17 11:46:40.262678+00	mw7ulm3bs2d7	32d68d60-5d8a-46ed-a874-ec2fb6e2506a
00000000-0000-0000-0000-000000000000	41	jaybbbort6gb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-04 17:04:46.68081+00	2025-09-04 18:48:50.574598+00	z4yg7quulzkj	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	84	34aauscua33e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 10:29:29.420398+00	2025-10-09 11:35:18.055007+00	ruvzybtl4oif	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	42	cupw43bukx5q	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-04 18:48:50.592454+00	2025-09-04 19:48:03.304162+00	jaybbbort6gb	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	43	tnjetdwca6fn	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-04 19:48:03.315614+00	2025-09-04 22:14:20.927619+00	cupw43bukx5q	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	47	pzhy54spidbu	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-04 22:14:20.942162+00	2025-09-05 00:07:49.98131+00	tnjetdwca6fn	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	48	ojpczojaxq5a	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-04 23:22:43.130853+00	2025-09-05 00:33:48.375709+00	\N	d473b426-fec4-4eb3-b508-cd67fbb3c4cb
00000000-0000-0000-0000-000000000000	50	jgllijlkmray	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-05 00:25:18.93954+00	2025-09-05 09:14:26.126261+00	\N	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	51	5bxcgl4q7qer	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-05 00:33:48.381107+00	2025-09-05 09:15:11.586608+00	ojpczojaxq5a	d473b426-fec4-4eb3-b508-cd67fbb3c4cb
00000000-0000-0000-0000-000000000000	52	25bxyhfv7ph5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-05 09:14:26.141172+00	2025-09-05 10:14:56.153425+00	jgllijlkmray	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	53	nkl6ekpd3bhc	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-05 09:15:11.588098+00	2025-09-05 10:27:33.999046+00	5bxcgl4q7qer	d473b426-fec4-4eb3-b508-cd67fbb3c4cb
00000000-0000-0000-0000-000000000000	56	3lwd4saogfm5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-05 10:27:34.003178+00	2025-09-05 13:30:48.888472+00	nkl6ekpd3bhc	d473b426-fec4-4eb3-b508-cd67fbb3c4cb
00000000-0000-0000-0000-000000000000	57	q4k2sz2wxuu5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-09-05 13:30:48.898682+00	2025-09-05 13:30:48.898682+00	3lwd4saogfm5	d473b426-fec4-4eb3-b508-cd67fbb3c4cb
00000000-0000-0000-0000-000000000000	55	tkpcmq4u4pz5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-05 10:14:56.171533+00	2025-09-05 13:30:49.752651+00	25bxyhfv7ph5	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	49	dnkd74bmhjeu	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-05 00:07:49.996039+00	2025-09-05 14:05:53.137887+00	pzhy54spidbu	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	59	wwrk66y3x7e7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-05 14:05:53.150172+00	2025-09-06 20:45:24.436815+00	dnkd74bmhjeu	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	60	vfsyyf2igc4o	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-06 20:45:24.462181+00	2025-09-07 10:24:31.430049+00	wwrk66y3x7e7	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	58	olbui5rdl6fr	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-05 13:30:49.753043+00	2025-09-07 10:39:36.368501+00	tkpcmq4u4pz5	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	61	32xokuh6xwz5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 10:24:31.448351+00	2025-09-07 11:33:48.392262+00	vfsyyf2igc4o	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	62	7qhm5bn56rdu	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 10:39:36.370682+00	2025-09-07 11:48:06.568125+00	olbui5rdl6fr	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	63	je63a7nnpzwb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 10:51:43.766229+00	2025-09-07 11:50:06.345453+00	\N	f49886a7-5f8c-48fd-8c08-2b396ec3341f
00000000-0000-0000-0000-000000000000	64	hz5sps465fvp	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 11:33:48.409631+00	2025-09-07 14:07:50.67257+00	32xokuh6xwz5	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	65	tz7n7v37wku3	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 11:48:06.574669+00	2025-09-07 14:16:04.692405+00	7qhm5bn56rdu	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	66	l4kvv3pjwscj	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 11:50:06.34696+00	2025-09-07 14:16:04.926067+00	je63a7nnpzwb	f49886a7-5f8c-48fd-8c08-2b396ec3341f
00000000-0000-0000-0000-000000000000	69	s2ngmwp2qufg	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-09-07 14:16:04.928964+00	2025-09-07 14:16:04.928964+00	l4kvv3pjwscj	f49886a7-5f8c-48fd-8c08-2b396ec3341f
00000000-0000-0000-0000-000000000000	67	oxqurjk72nmp	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 14:07:50.685307+00	2025-09-07 15:45:35.10306+00	hz5sps465fvp	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	70	uxby7vzzql3a	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 15:45:35.119057+00	2025-09-07 16:44:51.935205+00	oxqurjk72nmp	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	68	eneaqa2d3zcb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 14:16:04.70293+00	2025-09-07 16:46:31.849294+00	tz7n7v37wku3	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	71	rzutkckdrt3t	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 16:44:51.946736+00	2025-09-07 17:58:22.20446+00	uxby7vzzql3a	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	73	3y37leb6waqf	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 17:58:22.222581+00	2025-09-07 20:14:07.709551+00	rzutkckdrt3t	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	72	kqiw3k3bezrf	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 16:46:31.851289+00	2025-09-07 20:24:20.891016+00	eneaqa2d3zcb	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	74	k7qy2qqy2ubz	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 20:14:07.723079+00	2025-09-07 21:21:26.299119+00	3y37leb6waqf	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	76	s75rqd63anmh	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 21:21:26.316851+00	2025-09-07 22:37:49.851131+00	k7qy2qqy2ubz	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	75	fxiq626on4vi	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 20:24:20.910615+00	2025-09-07 22:56:03.930549+00	kqiw3k3bezrf	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	77	grhrtje6hixu	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 22:37:49.866949+00	2025-09-08 01:26:47.045815+00	s75rqd63anmh	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	78	o3jr3232rhee	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-07 22:56:03.939658+00	2025-09-08 02:11:08.065829+00	fxiq626on4vi	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	79	2x2wvyu4o4tt	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 01:26:47.063034+00	2025-09-08 02:25:20.749456+00	grhrtje6hixu	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	81	6pez2z5v64o6	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 02:25:20.755975+00	2025-09-08 03:24:32.165541+00	2x2wvyu4o4tt	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	82	ihwdh35sctp7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 03:24:32.177927+00	2025-09-08 10:29:07.26492+00	6pez2z5v64o6	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	80	ruvzybtl4oif	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 02:11:08.082375+00	2025-09-08 10:29:29.419952+00	o3jr3232rhee	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	83	id6ua4vrusy6	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 10:29:07.283946+00	2025-09-08 11:36:15.158796+00	ihwdh35sctp7	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	86	xqr35bfryocu	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-09-08 16:18:38.029973+00	2025-09-08 16:18:38.029973+00	\N	538f1ea3-5e61-4e60-9278-95987d2729fa
00000000-0000-0000-0000-000000000000	85	mo72lieusb3u	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 11:36:15.174666+00	2025-09-08 16:25:59.145373+00	id6ua4vrusy6	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	89	w7rcptlrx3ee	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-09-08 17:26:47.813241+00	2025-09-08 17:26:47.813241+00	\N	85b59aa2-ce8a-47b1-ae7c-6fcc69939760
00000000-0000-0000-0000-000000000000	88	7wvzqvgivxxm	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 17:08:31.904591+00	2025-09-08 18:11:03.825503+00	\N	0da73935-9126-41e2-a354-e577b631827e
00000000-0000-0000-0000-000000000000	87	p7l5nh4qclf7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 16:25:59.152269+00	2025-09-08 20:28:52.877439+00	mo72lieusb3u	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	92	eunzhn34gvmy	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 18:11:03.832917+00	2025-09-08 21:30:46.431613+00	7wvzqvgivxxm	0da73935-9126-41e2-a354-e577b631827e
00000000-0000-0000-0000-000000000000	90	myopogxhprcv	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 17:52:08.823508+00	2025-09-11 23:12:39.077011+00	\N	c8e57bc1-01ed-46bd-80bb-fe364d4e9ff7
00000000-0000-0000-0000-000000000000	91	jqxkf2gnf3nu	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 17:53:25.534836+00	2025-09-11 23:14:24.420265+00	\N	e54dd998-0f2a-4348-b0bb-be2d62c531c8
00000000-0000-0000-0000-000000000000	97	jxa6ikortbfi	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 21:30:46.434102+00	2025-09-15 20:50:01.368685+00	eunzhn34gvmy	0da73935-9126-41e2-a354-e577b631827e
00000000-0000-0000-0000-000000000000	95	etgwunuc55ls	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 20:28:52.889157+00	2025-09-08 21:27:28.360493+00	p7l5nh4qclf7	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	114	mw7ulm3bs2d7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-15 20:53:05.738339+00	2025-09-17 11:46:40.244225+00	\N	32d68d60-5d8a-46ed-a874-ec2fb6e2506a
00000000-0000-0000-0000-000000000000	111	piqam6qgzha2	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-15 09:07:10.349727+00	2025-09-22 13:43:58.751998+00	zghbyciuetqp	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	99	i47lba5f3aj6	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-09-08 22:02:37.955837+00	2025-09-08 22:02:37.955837+00	\N	762b8f3a-ef16-4ab1-a864-da12c58876b9
00000000-0000-0000-0000-000000000000	98	xrnfzp2evrpe	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 21:58:31.405845+00	2025-09-09 10:22:01.45193+00	\N	36979f83-31f4-4d7b-aed4-9f9a9f809e0c
00000000-0000-0000-0000-000000000000	100	2tecj4rtc6h6	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-09-09 10:22:01.474916+00	2025-09-09 10:22:01.474916+00	xrnfzp2evrpe	36979f83-31f4-4d7b-aed4-9f9a9f809e0c
00000000-0000-0000-0000-000000000000	101	udypqpb3oe5q	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-09 10:31:45.60496+00	2025-09-10 10:35:28.970898+00	\N	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	116	vldman7af5aw	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-22 13:43:58.770443+00	2025-09-23 09:08:27.184178+00	piqam6qgzha2	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	103	5worc7xrgklc	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-09-10 21:53:09.671863+00	2025-09-10 21:53:09.671863+00	\N	b7fd6f74-b274-438e-987d-4b2a8e6f2de0
00000000-0000-0000-0000-000000000000	102	ulrjvgtoqzvr	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-10 10:35:28.990871+00	2025-09-10 22:16:45.760835+00	udypqpb3oe5q	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	104	7vcbt7vww3im	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-10 22:16:45.775714+00	2025-09-11 01:37:15.846862+00	ulrjvgtoqzvr	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	117	uw5rtinrbpif	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-23 09:08:27.207901+00	2025-09-23 12:38:17.623946+00	vldman7af5aw	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	105	gs63x365kbvp	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-11 01:37:15.862328+00	2025-09-11 11:59:09.276035+00	7vcbt7vww3im	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	107	v3sfnb7gt7qh	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-09-11 23:12:39.086457+00	2025-09-11 23:12:39.086457+00	myopogxhprcv	c8e57bc1-01ed-46bd-80bb-fe364d4e9ff7
00000000-0000-0000-0000-000000000000	106	ru7uwhfdyrwl	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-11 11:59:09.298234+00	2025-09-12 21:36:12.222693+00	gs63x365kbvp	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	118	nysyz4lfs2ub	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-23 12:38:17.637051+00	2025-09-23 15:40:38.443643+00	uw5rtinrbpif	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	109	wo532gyzyidh	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-12 21:36:12.244449+00	2025-09-12 22:45:20.918603+00	ru7uwhfdyrwl	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	110	zghbyciuetqp	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-12 22:45:20.929989+00	2025-09-15 09:07:10.329147+00	wo532gyzyidh	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	96	qvssncnok6eg	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-08 21:27:28.374982+00	2025-09-15 09:07:25.050555+00	etgwunuc55ls	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	112	3o4baeuq7jbb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-09-15 09:07:25.050931+00	2025-09-15 09:07:25.050931+00	qvssncnok6eg	f8194e28-36b5-4166-9e8f-422d3e3a4ea6
00000000-0000-0000-0000-000000000000	108	h5ciwfj24ahm	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-11 23:14:24.424196+00	2025-09-24 11:17:26.965948+00	jqxkf2gnf3nu	e54dd998-0f2a-4348-b0bb-be2d62c531c8
00000000-0000-0000-0000-000000000000	119	omfigcr5zr34	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-23 15:40:38.457044+00	2025-09-26 20:13:19.262527+00	nysyz4lfs2ub	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	121	eza36ng35ux3	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-26 20:13:19.286038+00	2025-09-29 12:12:29.522718+00	omfigcr5zr34	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	122	6ugzodpl7zaq	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-29 12:12:29.543426+00	2025-09-30 13:23:10.717309+00	eza36ng35ux3	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	113	h4raxxcjq2vo	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-15 20:50:01.384433+00	2025-10-08 07:32:30.470314+00	jxa6ikortbfi	0da73935-9126-41e2-a354-e577b631827e
00000000-0000-0000-0000-000000000000	124	kmb6pjaeiscv	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-08 07:32:30.498878+00	2025-10-08 11:20:40.103957+00	h4raxxcjq2vo	0da73935-9126-41e2-a354-e577b631827e
00000000-0000-0000-0000-000000000000	123	exqas24p5cuo	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-30 13:23:10.743119+00	2025-10-09 11:41:46.000717+00	6ugzodpl7zaq	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	126	ou7pfl2645dc	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-09 11:35:18.064635+00	2025-10-09 17:32:02.33224+00	34aauscua33e	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	129	ytv763vdsus5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-09 17:32:02.354772+00	2025-10-09 19:21:25.942168+00	ou7pfl2645dc	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	127	ldabmqzb6gw2	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-09 11:41:46.002672+00	2025-10-09 21:45:48.571137+00	exqas24p5cuo	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	130	x7c44zui3vj7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-09 19:21:25.957441+00	2025-10-09 21:52:37.892408+00	ytv763vdsus5	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	132	qb3hu72xcpjp	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-09 21:52:37.894715+00	2025-10-09 23:03:00.104151+00	x7c44zui3vj7	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	133	zg2ki55ltulf	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-09 23:03:00.12876+00	2025-10-10 10:17:43.545665+00	qb3hu72xcpjp	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	128	zsihjc253oks	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-09 11:50:43.079081+00	2025-10-10 10:18:22.210586+00	\N	fd61d259-79fd-4452-ad8c-8da18c286a66
00000000-0000-0000-0000-000000000000	135	77g7b4s6d55j	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-10-10 10:18:22.21284+00	2025-10-10 10:18:22.21284+00	zsihjc253oks	fd61d259-79fd-4452-ad8c-8da18c286a66
00000000-0000-0000-0000-000000000000	131	jomvh55efgub	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-09 21:45:48.588256+00	2025-10-10 10:42:16.984868+00	ldabmqzb6gw2	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	136	hemflzibpiet	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-10 10:42:16.996191+00	2025-10-10 11:59:41.806361+00	jomvh55efgub	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	134	qfm67zlrlova	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-10 10:17:43.568559+00	2025-10-10 11:59:43.396261+00	zg2ki55ltulf	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	138	2g4rgutdjsj5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-10-10 11:59:43.3966+00	2025-10-10 11:59:43.3966+00	qfm67zlrlova	c5c9f0b0-7edd-478e-a8b0-b623fca931ac
00000000-0000-0000-0000-000000000000	137	nh7syfya33am	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-10 11:59:41.817271+00	2025-10-10 16:32:10.998631+00	hemflzibpiet	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	139	hifbvf4stpvt	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-10 16:32:11.0182+00	2025-10-10 17:30:26.031838+00	nh7syfya33am	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	125	3rtwggtysvgc	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-08 11:20:40.129985+00	2025-10-10 18:24:42.540158+00	kmb6pjaeiscv	0da73935-9126-41e2-a354-e577b631827e
00000000-0000-0000-0000-000000000000	120	4yjgd2zqghix	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-09-24 11:17:26.990763+00	2025-10-10 18:58:31.658231+00	h5ciwfj24ahm	e54dd998-0f2a-4348-b0bb-be2d62c531c8
00000000-0000-0000-0000-000000000000	141	5vfxceduhesp	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-10 18:24:42.549837+00	2025-10-10 20:55:57.264717+00	3rtwggtysvgc	0da73935-9126-41e2-a354-e577b631827e
00000000-0000-0000-0000-000000000000	143	vd2klopwwrlz	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-10 20:55:57.279285+00	2025-10-10 23:24:36.643592+00	5vfxceduhesp	0da73935-9126-41e2-a354-e577b631827e
00000000-0000-0000-0000-000000000000	140	ypwwyoedd65d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-10 17:30:26.048336+00	2025-10-10 23:33:28.363925+00	hifbvf4stpvt	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	145	mv4jcpkn2ma7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-10 23:33:28.368512+00	2025-10-11 00:31:38.888412+00	ypwwyoedd65d	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	144	fp4z5tpqz6cn	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-10 23:24:36.657667+00	2025-10-11 00:43:45.454372+00	vd2klopwwrlz	0da73935-9126-41e2-a354-e577b631827e
00000000-0000-0000-0000-000000000000	142	rmfqwv6jmlhn	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-10 18:58:31.6773+00	2025-10-11 16:52:06.887233+00	4yjgd2zqghix	e54dd998-0f2a-4348-b0bb-be2d62c531c8
00000000-0000-0000-0000-000000000000	147	hdguefduttkg	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 00:43:45.464733+00	2025-10-11 02:32:06.712769+00	fp4z5tpqz6cn	0da73935-9126-41e2-a354-e577b631827e
00000000-0000-0000-0000-000000000000	148	yl6cr4uoedkw	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-10-11 02:32:06.73548+00	2025-10-11 02:32:06.73548+00	hdguefduttkg	0da73935-9126-41e2-a354-e577b631827e
00000000-0000-0000-0000-000000000000	146	fhusjz3ehsst	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 00:31:38.904468+00	2025-10-11 02:53:47.624715+00	mv4jcpkn2ma7	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	149	ixfipm34sjnx	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 02:53:47.630414+00	2025-10-11 03:52:26.241808+00	fhusjz3ehsst	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	150	i5zl2avwcvub	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 03:52:26.265227+00	2025-10-11 10:13:08.489679+00	ixfipm34sjnx	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	151	yq7crcflrtbg	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 10:13:08.508604+00	2025-10-11 15:36:29.583109+00	i5zl2avwcvub	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	152	ngs642uugita	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 15:36:29.60143+00	2025-10-11 16:34:32.643352+00	yq7crcflrtbg	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	155	imzgx2ca2aad	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 16:53:23.217243+00	2025-10-11 17:58:06.539455+00	\N	f2d23058-e7cb-47b1-a5bd-8785d91afc15
00000000-0000-0000-0000-000000000000	153	5ofpt4lolptz	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 16:34:32.659802+00	2025-10-11 19:20:18.545815+00	ngs642uugita	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	157	vzjbzbsco7f4	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 19:20:18.563291+00	2025-10-11 22:05:32.899666+00	5ofpt4lolptz	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	158	566j44wgr5zh	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 22:05:32.919988+00	2025-10-11 23:04:07.118716+00	vzjbzbsco7f4	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	159	iezrjjinzyhn	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 23:04:07.13694+00	2025-10-12 00:02:16.885989+00	566j44wgr5zh	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	160	kgkkh2awajc2	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-12 00:02:16.905982+00	2025-10-12 02:37:47.262148+00	iezrjjinzyhn	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	161	jjyrrqy4iagk	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-12 02:37:47.282651+00	2025-10-12 12:21:02.775376+00	kgkkh2awajc2	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	162	o6ptj6cmnpbo	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-12 12:21:02.786198+00	2025-10-12 13:23:07.93813+00	jjyrrqy4iagk	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	163	kaius6e65tnl	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-12 13:23:07.950159+00	2025-10-12 15:25:18.385826+00	o6ptj6cmnpbo	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	164	45vly6kie7bg	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-12 15:25:18.409538+00	2025-10-12 17:24:00.994722+00	kaius6e65tnl	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	154	cumt4r3mmvzt	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 16:52:06.894488+00	2025-10-12 19:20:36.14474+00	rmfqwv6jmlhn	e54dd998-0f2a-4348-b0bb-be2d62c531c8
00000000-0000-0000-0000-000000000000	165	hovmp3afts3q	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-12 17:24:01.007417+00	2025-10-12 21:43:57.39026+00	45vly6kie7bg	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	167	j3bxv5h2jptx	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-12 21:43:57.408509+00	2025-10-12 22:46:21.9981+00	hovmp3afts3q	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	168	zjngvkvz6cnn	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-12 22:46:22.007384+00	2025-10-12 23:44:33.571112+00	j3bxv5h2jptx	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	169	km6ujc2if2hv	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-12 23:44:33.595587+00	2025-10-13 01:03:46.831419+00	zjngvkvz6cnn	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	170	7icu6e7gvfhb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-13 01:03:46.857675+00	2025-10-13 08:04:06.009447+00	km6ujc2if2hv	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	171	cnu4n7t2gowf	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-13 08:04:06.031942+00	2025-10-13 10:25:15.588561+00	7icu6e7gvfhb	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	172	4hpbti4bkgom	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-13 10:25:15.613606+00	2025-10-13 11:45:29.554422+00	cnu4n7t2gowf	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	173	izmhoaqakqcz	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-13 11:45:29.571919+00	2025-10-13 13:49:14.054607+00	4hpbti4bkgom	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	174	hbajexieodzw	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-13 13:49:14.073777+00	2025-10-13 14:48:15.188233+00	izmhoaqakqcz	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	166	gqedxnlcg5od	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-12 19:20:36.167933+00	2025-10-13 19:50:14.999946+00	cumt4r3mmvzt	e54dd998-0f2a-4348-b0bb-be2d62c531c8
00000000-0000-0000-0000-000000000000	176	cgiqhpwjgkhs	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-13 19:50:15.024373+00	2025-10-14 08:44:20.479532+00	gqedxnlcg5od	e54dd998-0f2a-4348-b0bb-be2d62c531c8
00000000-0000-0000-0000-000000000000	175	fqsivnunypyp	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-13 14:48:15.205152+00	2025-10-14 09:08:41.310466+00	hbajexieodzw	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	177	m4ewnowlc4hq	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-14 08:44:20.506048+00	2025-10-14 12:26:08.394765+00	cgiqhpwjgkhs	e54dd998-0f2a-4348-b0bb-be2d62c531c8
00000000-0000-0000-0000-000000000000	156	34mrayngzwlj	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-11 17:58:06.554204+00	2025-10-15 11:09:42.575856+00	imzgx2ca2aad	f2d23058-e7cb-47b1-a5bd-8785d91afc15
00000000-0000-0000-0000-000000000000	180	ioki4vr5tzbk	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-10-15 11:09:42.593999+00	2025-10-15 11:09:42.593999+00	34mrayngzwlj	f2d23058-e7cb-47b1-a5bd-8785d91afc15
00000000-0000-0000-0000-000000000000	179	gn2s3fkcidm2	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-14 12:26:08.415028+00	2025-10-15 11:09:48.394307+00	m4ewnowlc4hq	e54dd998-0f2a-4348-b0bb-be2d62c531c8
00000000-0000-0000-0000-000000000000	181	d4wv6ynqijz4	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-15 11:09:48.394662+00	2025-10-15 15:52:08.425316+00	gn2s3fkcidm2	e54dd998-0f2a-4348-b0bb-be2d62c531c8
00000000-0000-0000-0000-000000000000	178	oton465m2k7i	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-14 09:08:41.313547+00	2025-10-15 16:03:01.521463+00	fqsivnunypyp	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	183	yj2fgsktqbn5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-15 16:03:01.525813+00	2025-10-16 08:16:16.037173+00	oton465m2k7i	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	184	kqw3t4yffatm	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-16 08:16:16.063701+00	2025-10-16 09:52:24.909494+00	yj2fgsktqbn5	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	185	x4q3hjyvtt3x	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-10-16 09:52:24.926227+00	2025-10-16 09:52:24.926227+00	kqw3t4yffatm	d6774026-556f-455e-acfa-33d6e1b3537d
00000000-0000-0000-0000-000000000000	182	x7kzw4tnm6ob	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	t	2025-10-15 15:52:08.444448+00	2025-10-17 10:43:24.507804+00	d4wv6ynqijz4	e54dd998-0f2a-4348-b0bb-be2d62c531c8
00000000-0000-0000-0000-000000000000	186	3ysjrdgu7ana	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	f	2025-10-17 10:43:24.531704+00	2025-10-17 10:43:24.531704+00	x7kzw4tnm6ob	e54dd998-0f2a-4348-b0bb-be2d62c531c8
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id) FROM stdin;
e54dd998-0f2a-4348-b0bb-be2d62c531c8	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-08 17:53:25.519306+00	2025-10-17 10:43:24.566262+00	\N	aal1	\N	2025-10-17 10:43:24.566144	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36 OPR/92.0.0.0	77.111.247.44	\N	\N
f49886a7-5f8c-48fd-8c08-2b396ec3341f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-07 10:51:43.759939+00	2025-09-07 14:16:04.938545+00	\N	aal1	\N	2025-09-07 14:16:04.938471	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0	88.169.243.109	\N	\N
32d68d60-5d8a-46ed-a874-ec2fb6e2506a	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-15 20:53:05.727196+00	2025-09-17 11:46:40.293328+00	\N	aal1	\N	2025-09-17 11:46:40.293246	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36	86.203.90.57	\N	\N
762b8f3a-ef16-4ab1-a864-da12c58876b9	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-08 22:02:37.95338+00	2025-09-08 22:02:37.95338+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0	88.169.243.109	\N	\N
36979f83-31f4-4d7b-aed4-9f9a9f809e0c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-08 21:58:31.400432+00	2025-09-09 10:22:01.502252+00	\N	aal1	\N	2025-09-09 10:22:01.502134	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0	88.169.243.109	\N	\N
b7fd6f74-b274-438e-987d-4b2a8e6f2de0	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-10 21:53:09.645466+00	2025-09-10 21:53:09.645466+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/501.2.0.65.109;FBBV/717317385;FBDV/iPhone12,1;FBMD/iPhone;FBSN/iOS;FBSV/17.6.1;FBSS/2;FBCR/;FBID/phone;FBLC/fr_FR;FBOP/80]	90.119.140.17	\N	\N
d473b426-fec4-4eb3-b508-cd67fbb3c4cb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-04 23:22:43.117111+00	2025-09-05 13:30:48.909275+00	\N	aal1	\N	2025-09-05 13:30:48.90918	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0	88.169.243.109	\N	\N
0da73935-9126-41e2-a354-e577b631827e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-08 17:08:31.889766+00	2025-10-11 02:32:06.76044+00	\N	aal1	\N	2025-10-11 02:32:06.75846	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 OPR/122.0.0.0	88.169.243.109	\N	\N
fd61d259-79fd-4452-ad8c-8da18c286a66	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-10-09 11:50:43.070658+00	2025-10-10 10:18:22.217876+00	\N	aal1	\N	2025-10-10 10:18:22.217799	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 OPR/122.0.0.0	88.169.243.109	\N	\N
c8e57bc1-01ed-46bd-80bb-fe364d4e9ff7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-08 17:52:08.812386+00	2025-09-11 23:12:39.10399+00	\N	aal1	\N	2025-09-11 23:12:39.103893	Mozilla/5.0 (Linux; Android 14; SM-S911B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/139.0.7258.158 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/522.0.0.58.109;]	78.246.249.68	\N	\N
c5c9f0b0-7edd-478e-a8b0-b623fca931ac	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-05 00:25:18.929885+00	2025-10-10 11:59:43.405201+00	\N	aal1	\N	2025-10-10 11:59:43.404568	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 OPR/122.0.0.0	88.169.243.109	\N	\N
f8194e28-36b5-4166-9e8f-422d3e3a4ea6	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-04 16:06:34.808716+00	2025-09-15 09:07:25.05733+00	\N	aal1	\N	2025-09-15 09:07:25.056263	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0	88.169.243.109	\N	\N
538f1ea3-5e61-4e60-9278-95987d2729fa	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-08 16:18:38.002337+00	2025-09-08 16:18:38.002337+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0	88.169.243.109	\N	\N
85b59aa2-ce8a-47b1-ae7c-6fcc69939760	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-08 17:26:47.804547+00	2025-09-08 17:26:47.804547+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0	88.169.243.109	\N	\N
f2d23058-e7cb-47b1-a5bd-8785d91afc15	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-10-11 16:53:23.20812+00	2025-10-15 11:09:42.643316+00	\N	aal1	\N	2025-10-15 11:09:42.643191	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36 OPR/92.0.0.0	88.169.243.109	\N	\N
d6774026-556f-455e-acfa-33d6e1b3537d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	2025-09-09 10:31:45.595104+00	2025-10-16 09:52:24.940855+00	\N	aal1	\N	2025-10-16 09:52:24.940252	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36	88.169.243.109	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2	authenticated	authenticated	phiromyip@hotmail.fr	$2a$10$xwGodcg7UHwzXf.LKXb0re9U.tfIJRk3WUIJLmnB9s41LXAnPv2je	2025-09-04 21:38:23.512732+00	\N		2025-09-04 21:38:05.740629+00		\N			\N	2025-09-04 21:42:13.162544+00	{"provider": "email", "providers": ["email"]}	{"sub": "7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2", "email": "phiromyip@hotmail.fr", "email_verified": true, "phone_verified": false}	\N	2025-09-04 21:38:05.591075+00	2025-09-05 09:36:24.001773+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	authenticated	authenticated	mjeremy14@gmail.com	$2a$10$Ad4IpRfAQhCZ6P9ptEC6m.GNs.9hoH2.mXDZRXXmZcHe4rPPxIDO2	2025-09-03 00:28:20.875472+00	\N		2025-09-03 00:28:06.164828+00		\N			\N	2025-10-11 16:53:23.206426+00	{"provider": "email", "providers": ["email"]}	{"sub": "03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b", "email": "mjeremy14@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-09-03 00:28:06.138702+00	2025-10-17 10:43:24.547903+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	cb55410e-aeef-46e9-ba41-52dfc34005e0	authenticated	authenticated	wilmed381409@gmail.com	$2a$10$zmPmpoSGxwwQeOt0rSNK7e.g.C4H2hayFEwKVi16jo7kZsBIWgPtK	2025-09-08 19:21:55.271508+00	\N		2025-09-08 19:21:12.671355+00		\N			\N	2025-09-08 19:22:46.524556+00	{"provider": "email", "providers": ["email"]}	{"sub": "cb55410e-aeef-46e9-ba41-52dfc34005e0", "email": "wilmed381409@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-09-08 19:21:12.5522+00	2025-09-08 19:22:46.529121+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: audit_xp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_xp (id, user_id, quest_id, delta_force, delta_endurance, delta_agilite, delta_mental, delta_total, created_at) FROM stdin;
e7d0cd99-6d7a-4548-8e7f-213b06a3f46c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	20	5	0	5	30	2025-09-04 00:42:06.461263+00
ebbdff73-3d33-4479-8235-69ba5ac74228	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	35c3ffdc-3c54-422a-84e1-cd9ab09bbb3a	30	10	5	5	50	2025-09-04 01:48:30.559642+00
8faedb17-50ed-45f2-958b-1f31de323268	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	35c3ffdc-3c54-422a-84e1-cd9ab09bbb3a	30	10	5	5	50	2025-09-04 01:48:31.494469+00
96579163-d3b8-4047-b96b-59f98cc4e90c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	5ec3cffb-1479-4256-ae96-923c0e914848	20	15	5	10	50	2025-09-05 00:12:43.341033+00
8882b3ad-aec5-4cef-8cd0-f0d3329745ae	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 18:12:56.16079+00
b5b5336a-6795-42cf-a4aa-6f43a7266c9b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 21:27:33.642257+00
ad5cc3e3-f0de-4c17-b5c0-32f44bf5a2bc	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 21:28:27.267524+00
158dd154-609b-44d0-90f9-ca73125bb35b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 21:31:28.049627+00
83c180be-d041-4cc5-b66d-7a85cf93dd92	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-08 21:32:47.455128+00
163771c1-a301-402c-a3c0-117595c5e0cb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 21:34:39.312845+00
78fd9bc2-b6a4-49bd-9d47-b42b7b241ebe	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-08 21:38:08.669987+00
0338784e-4d7e-497f-a68e-577ec1a74e5a	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-08 21:41:12.539009+00
a30ae3ec-6d4e-48cf-9a8d-1280972f0d93	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-08 21:50:07.54174+00
c4e60c5f-4e9b-44d3-aefd-f77ac873d590	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 21:50:43.109363+00
40ed544d-ee74-49c6-b899-729b39b31c38	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 21:53:14.245621+00
5470afe3-3597-4ab3-89b9-357e63bbcd00	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 21:55:41.143748+00
d0ca9b7b-6157-435a-a4a6-3ca485ebc76f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 21:57:59.732632+00
e9e25fb4-2adc-4c58-947e-6099238f6211	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 21:58:49.399819+00
1bc9d8a0-54ad-423d-91d2-debd96bc1125	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 22:02:14.07613+00
a9f72060-b2d3-4fd4-80ea-8e7ab63d7231	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 22:02:57.18456+00
242fffa7-8ef8-4e6d-a0ef-20f79f891f24	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 22:04:49.706177+00
f02c4a04-0798-4047-b014-7c186e4b64c1	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-08 22:11:41.591266+00
d84db8e5-47c2-4894-bbdf-dd7512949297	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	056391cc-932a-479c-b67d-c0013c792b2b	10	30	10	10	60	2025-09-08 22:12:07.136365+00
24574f17-fd90-4d13-a202-6e91939143b7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-09 10:22:23.106916+00
371488a4-8e40-4029-b9d4-e2239e682565	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-09 10:26:24.071579+00
c0ffc26f-fcde-4711-bba6-628658f4dd89	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-09 10:27:12.677508+00
515489c7-5b2a-4cc6-a6f0-8ab31f34ed60	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-09 10:37:53.11916+00
e21fec75-7594-40ae-a71b-7581fcf6c11a	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-09 10:38:31.211366+00
757fb220-690e-4e37-9dee-2d9a7c3cb549	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-09 10:44:05.468842+00
93767631-6a31-4367-879a-470056b4187d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-09 10:48:39.389788+00
1fb4beba-5b4f-4793-810f-5d003cde9030	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-10 10:37:50.003151+00
9d01509e-a468-4562-a536-8b29532a20f7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-10 10:43:11.556064+00
77f83e8f-bfd0-49d7-8eec-5a0e5cf210fc	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-10 10:45:49.758828+00
7b572772-e476-4496-81cb-755e1ebbd239	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-09-10 21:56:37.748607+00
d73dd596-2df6-45ce-96f6-dbe4c7109a14	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	0a59640d-d3ad-4e73-baf6-c9f6757f4937	0	0	0	0	0	2025-09-11 23:13:37.788734+00
dc81ca4f-ae52-4e07-8bb8-bbd4fa6233e6	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-15 09:29:08.431157+00
1fe33b83-3d65-4631-9fd3-a354a6ada1b5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-15 09:30:00.787341+00
71698852-c5bb-4d67-bc4c-26bb4b557e7c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-15 09:32:23.759234+00
827bf4dd-0ed8-4759-aea6-d00c8b43257f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-15 09:34:14.360374+00
41cf187e-b824-4365-b5e8-43ed14eabcad	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-15 09:35:20.982984+00
319016db-59ef-4399-a108-394c382f1ad9	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-15 09:36:58.245742+00
7d809549-3daa-42c8-a3e3-710416f8457d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-15 09:37:32.892557+00
46bbdeb5-6d36-4713-a82c-328cec320f5e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-22 13:44:16.471969+00
f452c58e-8ac3-44d6-8c30-15ef65630161	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-22 14:04:02.442854+00
e5864478-08c9-40e3-9496-6aaa81976b89	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-22 14:11:21.735243+00
c4c79a12-882a-4777-b4a8-a2a2ab45254d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-22 14:13:58.855717+00
bf75d59c-6148-4bbb-8fa9-2fb6963a3cec	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	5	5	5	5	20	2025-09-22 14:19:28.893497+00
f1a5b856-787b-4bf6-b366-a02b011e75d6	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	59ae035b-4725-45bc-89d9-90acbe8eb691	0	10	0	0	10	2025-09-23 12:48:40.306324+00
a5623e8b-f812-46f1-b1c1-e3807874931b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	0a59640d-d3ad-4e73-baf6-c9f6757f4937	0	0	0	0	0	2025-09-23 13:03:45.174233+00
31e72811-4bb7-4350-8a3f-6c13002e6a75	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	0a59640d-d3ad-4e73-baf6-c9f6757f4937	0	0	0	0	0	2025-10-09 11:43:17.082829+00
f7b0111c-8cc0-473d-bf92-f3afb93532b0	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	3	2	2	2	9	2025-10-09 11:59:09.195493+00
aa8266c2-f0a4-4cdc-ac0f-f8e2978ec9a4	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	3	2	2	2	9	2025-10-10 10:19:28.750397+00
c7629800-9e18-487d-8133-dfc5abd6548d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	3	2	2	2	9	2025-10-10 10:47:29.269654+00
a949820e-a333-4a5a-9e0c-f93a955ad8c3	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	20	5	0	5	30	2025-10-10 17:20:58.32083+00
6ae41e1b-3a9e-410b-ba52-7d1969879ed7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	0a59640d-d3ad-4e73-baf6-c9f6757f4937	0	0	0	0	0	2025-10-11 15:38:52.953125+00
91cd7a90-2382-40ea-acac-27a301bf35df	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-10-11 15:39:47.856612+00
cc7f17ec-ab15-4122-9127-a5c0220283ce	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	5	5	5	10	25	2025-10-11 15:39:48.299534+00
78985115-f1fc-492f-9a7b-924f668f1d56	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	5	2	1	0	8	2025-10-11 15:44:09.387332+00
ab272832-5da6-4aa6-9a9c-7892a5664a4f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	5	2	1	0	8	2025-10-11 15:44:11.721061+00
197ae5d3-40f9-41db-a07a-bc31bb0075e2	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	5	2	1	0	8	2025-10-11 15:44:58.386245+00
a616e10f-5e8a-44cc-a52c-f3372e37a2ac	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	5	2	1	0	8	2025-10-11 15:46:03.505465+00
fca29ed2-c283-47db-9a94-bab8b58964e7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	5	2	1	0	8	2025-10-11 15:46:24.158719+00
\.


--
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.badges (id, slug, name, emoji, condition_type, condition_value, description, created_at) FROM stdin;
3a0865d0-f718-4caa-9618-867179ae5c9c	novice-sans-cardio	Novice sans cardio	🥉	min_sessions	3	3 séances complétées dans la campagne.	2025-09-03 00:23:34.649554+00
88499474-23e8-4ed1-94e0-04927a2f6d04	superset-slayer	Superset Slayer	⚡	first_superset	1	Tu as réussi ta première séance en superset.	2025-09-03 00:23:34.649554+00
acc86c59-4e55-4d3f-ad49-17d7d23c6cf9	boss-final-vaincu	Boss Final Vaincu	🏆	beat_final_boss	1	Tu as vaincu le Dungeon Challenge.	2025-09-03 00:23:34.649554+00
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaigns (id, slug, title, description, is_active, created_at, level_required, equipment_tags, estimated_duration_weeks, is_published) FROM stdin;
f582bde3-d07e-4613-926d-0968c50a1222	hyrox-avance	Hyrox Avancé	La campagne ultime pour les sportifs avancé souhaitant un programme Hyrox complet afin de performer sur leurs futures courses	t	2025-09-07 10:56:05.893493+00	\N	\N	4	t
b38309ee-b9df-45bb-a2d5-07b16f7b97f2	reveil-du-heros	Réveil du Héros	Un parcours pour (re)mettre la machine en route, full body et fun au rendez-vous !	t	2025-09-03 00:23:34.649554+00	BEGINNER	{POIDS_CORPS}	4	t
7d881dbe-51a4-4a44-8ee2-66e48837defa	test	test	test	t	2025-09-08 17:35:06.312443+00	BEGINNER	{POIDS_CORPS}	4	t
8d451310-21ef-4a65-bd1c-4ea7f2a4e1de	campagne-test	Campagne test	Ceci est une nouvelle campagne test	t	2025-10-09 11:52:08.01191+00	INTERMEDIATE	{POIDS_CORPS,HALTERES}	4	t
b48d65fd-ee26-499d-be71-3aacc3babedf	muscu	Musculation	muscu	t	2025-10-10 23:58:15.354653+00	BEGINNER	{}	4	t
\.


--
-- Data for Name: exercise_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercise_logs (id, session_id, exercise_id, set_number, reps_completed, weight_used, completed_at, created_at) FROM stdin;
7bd382cc-dec6-44e3-b7fb-f7d2e5393b0b	00773212-84f9-446a-8e14-e82902067b26	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	\N	2025-10-10 17:30:17.397843+00	2025-10-10 17:30:17.397843+00
fc3496e3-116e-4a0d-b226-75c99bf86d55	00773212-84f9-446a-8e14-e82902067b26	74189eb6-43ae-4aae-842e-accc38d9d823	2	8	\N	2025-10-10 17:30:34.505697+00	2025-10-10 17:30:34.505697+00
9c84a62a-da16-4543-9dae-5e6810494871	00773212-84f9-446a-8e14-e82902067b26	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	\N	2025-10-10 17:35:58.508942+00	2025-10-10 17:35:58.508942+00
4f1af1b9-20bb-47ce-9d61-296236c7f2a8	00773212-84f9-446a-8e14-e82902067b26	74189eb6-43ae-4aae-842e-accc38d9d823	2	8	\N	2025-10-10 17:36:52.263184+00	2025-10-10 17:36:52.263184+00
c0188aff-d34a-4d43-b007-1b376863a698	00773212-84f9-446a-8e14-e82902067b26	74189eb6-43ae-4aae-842e-accc38d9d823	3	8	\N	2025-10-10 17:36:55.005141+00	2025-10-10 17:36:55.005141+00
3a15f49f-c8f3-436e-a1cd-b2e3e8179aa0	00773212-84f9-446a-8e14-e82902067b26	027ae547-6764-4244-a16d-f4dde6df985e	1	10	\N	2025-10-10 17:36:56.123897+00	2025-10-10 17:36:56.123897+00
af53bbf7-611a-4d41-aa20-a5fcc93e603b	00773212-84f9-446a-8e14-e82902067b26	027ae547-6764-4244-a16d-f4dde6df985e	2	10	\N	2025-10-10 17:36:58.066998+00	2025-10-10 17:36:58.066998+00
c9d28c8d-6d58-4807-9e94-3356232a94a3	00773212-84f9-446a-8e14-e82902067b26	027ae547-6764-4244-a16d-f4dde6df985e	3	10	\N	2025-10-10 17:36:59.641976+00	2025-10-10 17:36:59.641976+00
3b46a274-33d5-47bf-9eb5-213c164e3518	3c3be575-c4bd-4af4-a142-7b1f2862ece1	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	\N	2025-10-10 17:48:21.544247+00	2025-10-10 17:48:21.544247+00
482012f6-2730-40f0-a04e-eb4a1eda3b1f	3c3be575-c4bd-4af4-a142-7b1f2862ece1	74189eb6-43ae-4aae-842e-accc38d9d823	2	8	\N	2025-10-10 17:48:33.428283+00	2025-10-10 17:48:33.428283+00
3d8b9e98-b7ee-483d-ba27-8981af84b2f1	3c3be575-c4bd-4af4-a142-7b1f2862ece1	74189eb6-43ae-4aae-842e-accc38d9d823	3	8	\N	2025-10-10 17:48:34.73661+00	2025-10-10 17:48:34.73661+00
06acc55d-2fa6-4b4c-acea-3098e27a15e3	3c3be575-c4bd-4af4-a142-7b1f2862ece1	027ae547-6764-4244-a16d-f4dde6df985e	1	10	\N	2025-10-10 17:48:35.959426+00	2025-10-10 17:48:35.959426+00
70eaa04d-2011-4ed7-ab5a-a1f737c5b3d5	3c3be575-c4bd-4af4-a142-7b1f2862ece1	027ae547-6764-4244-a16d-f4dde6df985e	2	10	\N	2025-10-10 17:48:43.884346+00	2025-10-10 17:48:43.884346+00
effcfa68-6ca1-43f6-a31b-78ce430887b5	3c3be575-c4bd-4af4-a142-7b1f2862ece1	027ae547-6764-4244-a16d-f4dde6df985e	3	10	\N	2025-10-10 17:48:44.916593+00	2025-10-10 17:48:44.916593+00
15c113b7-f459-4cf6-bfd0-43e19867dd5b	1826ea4d-dafb-4a56-a25b-3248727d88e4	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	22.50	2025-10-10 18:10:30.375881+00	2025-10-10 18:10:30.375881+00
38e7f703-3ef7-4896-99ba-2146b21b80d0	1826ea4d-dafb-4a56-a25b-3248727d88e4	74189eb6-43ae-4aae-842e-accc38d9d823	2	8	22.50	2025-10-10 18:17:52.475475+00	2025-10-10 18:17:52.475475+00
865db970-067b-4a01-ad80-8dd17fdc96ea	9a30b13b-571d-45a5-98f8-75fbe786422b	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	\N	2025-10-10 19:10:54.70036+00	2025-10-10 19:10:54.70036+00
fadd3788-55b3-4587-af14-ae63c4c00161	fadb3415-f092-4d87-b19f-2d6088778d3b	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	22.50	2025-10-10 23:25:49.732772+00	2025-10-10 23:25:49.732772+00
03ab934d-e042-4d0c-a53e-8fe6b4ca6da6	e1b6bff1-3c80-439a-821c-56ef924b6670	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	1	8	22.50	2025-10-11 00:00:22.662664+00	2025-10-11 00:00:22.662664+00
7b217f6a-e66b-42ee-9139-2c47a8fdbf1b	e1b6bff1-3c80-439a-821c-56ef924b6670	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	2	8	22.50	2025-10-11 00:00:28.791352+00	2025-10-11 00:00:28.791352+00
c4d2d525-f4a4-480a-b323-f1cd7edb6764	e1b6bff1-3c80-439a-821c-56ef924b6670	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	3	8	22.50	2025-10-11 00:00:33.076513+00	2025-10-11 00:00:33.076513+00
1688bb7b-fea9-4cd0-88ae-0f0670072ed6	56b740bd-10c1-4200-98e2-911a04026923	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	22.50	2025-10-11 03:09:35.291661+00	2025-10-11 03:09:35.291661+00
67332c7d-177b-48fb-b3ba-de476fbe7103	197730fa-5a6c-4d87-9f7f-b100b42a7478	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	22.50	2025-10-11 04:10:58.077862+00	2025-10-11 04:10:58.077862+00
ad82f7be-0699-4ea0-9462-89d90adf390d	b5d77e18-0a07-43fe-bb48-338bc6829f6e	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	5.00	2025-10-11 04:11:20.799868+00	2025-10-11 04:11:20.799868+00
468bc3fe-bf6b-4fcc-b618-b71ce1757fb1	b5d77e18-0a07-43fe-bb48-338bc6829f6e	74189eb6-43ae-4aae-842e-accc38d9d823	2	8	5.50	2025-10-11 04:11:45.764099+00	2025-10-11 04:11:45.764099+00
b7f80bd2-50b8-4a3d-9435-9c4d204e68e3	b5d77e18-0a07-43fe-bb48-338bc6829f6e	74189eb6-43ae-4aae-842e-accc38d9d823	3	8	5.00	2025-10-11 04:11:49.161822+00	2025-10-11 04:11:49.161822+00
153b42fb-a57d-430a-872d-4a46c4e88b52	b5d77e18-0a07-43fe-bb48-338bc6829f6e	027ae547-6764-4244-a16d-f4dde6df985e	1	10	8.00	2025-10-11 04:11:58.723775+00	2025-10-11 04:11:58.723775+00
4bb7139a-02ab-45d8-a9ff-152b7add40aa	b5d77e18-0a07-43fe-bb48-338bc6829f6e	027ae547-6764-4244-a16d-f4dde6df985e	2	10	9.00	2025-10-11 04:12:02.67448+00	2025-10-11 04:12:02.67448+00
d773e364-6435-4b0d-b124-a1e6215edf68	b5d77e18-0a07-43fe-bb48-338bc6829f6e	027ae547-6764-4244-a16d-f4dde6df985e	3	10	7.00	2025-10-11 04:12:06.463415+00	2025-10-11 04:12:06.463415+00
f2bcefbc-b546-4667-afc0-b81d238ed364	4cd9151e-1898-4217-be71-e52557e6a6e2	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	6.50	2025-10-11 04:13:58.990553+00	2025-10-11 04:13:58.990553+00
c1befa62-6e2f-431f-9a9f-7b004c1e3b0e	4cd9151e-1898-4217-be71-e52557e6a6e2	74189eb6-43ae-4aae-842e-accc38d9d823	2	11	5.00	2025-10-11 04:14:03.71312+00	2025-10-11 04:14:03.71312+00
f2d6b74b-ea41-4f93-bc2c-fea8143025fc	4cd9151e-1898-4217-be71-e52557e6a6e2	74189eb6-43ae-4aae-842e-accc38d9d823	3	8	4.50	2025-10-11 04:14:07.900456+00	2025-10-11 04:14:07.900456+00
02bc2a0c-b659-4580-bc88-9e008d0e34fb	4cd9151e-1898-4217-be71-e52557e6a6e2	027ae547-6764-4244-a16d-f4dde6df985e	1	10	4.50	2025-10-11 04:14:12.221494+00	2025-10-11 04:14:12.221494+00
fa87bc45-957f-4e0c-b960-275ae3f5c2ee	4cd9151e-1898-4217-be71-e52557e6a6e2	027ae547-6764-4244-a16d-f4dde6df985e	2	10	7.00	2025-10-11 04:14:15.767669+00	2025-10-11 04:14:15.767669+00
e83b8041-a999-4b3b-9950-b926ff7e7593	4cd9151e-1898-4217-be71-e52557e6a6e2	027ae547-6764-4244-a16d-f4dde6df985e	3	10	4.50	2025-10-11 04:14:19.180808+00	2025-10-11 04:14:19.180808+00
a121bd18-d449-47be-9800-df04e478fee3	b0652b9f-ff7f-45bc-99ca-0f360e491e0c	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	2.00	2025-10-11 15:37:15.736295+00	2025-10-11 15:37:15.736295+00
f5ab486a-f042-4829-b93a-54f6f1007906	56fdea34-6bdd-4a5c-8639-68c7bea9237d	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	2.50	2025-10-11 15:38:10.603467+00	2025-10-11 15:38:10.603467+00
bd8dda3e-099e-4d9d-b3c2-d3d257d6c7ca	ef5695a1-2570-4161-8531-3f20872574e0	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	1	8	7.50	2025-10-11 15:44:07.279026+00	2025-10-11 15:44:07.279026+00
8bfc1c4e-cad0-4cc7-bb36-f05c8edbe5ee	9b5cf0cb-8f29-4ad4-b06c-edf5c2804e9d	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	1	8	16.50	2025-10-11 15:44:48.496005+00	2025-10-11 15:44:48.496005+00
17d79e54-f767-4c60-8ba9-a1bc22ba384a	9b5cf0cb-8f29-4ad4-b06c-edf5c2804e9d	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	2	8	20.50	2025-10-11 15:44:55.321286+00	2025-10-11 15:44:55.321286+00
f929fc38-31de-4d00-bd76-26301997986d	213e0d09-dfa2-403a-9090-9bff5e4279ef	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	1	8	14.00	2025-10-11 15:46:14.846006+00	2025-10-11 15:46:14.846006+00
b876b467-c1fc-4a42-b635-5efeea6c0de8	213e0d09-dfa2-403a-9090-9bff5e4279ef	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	2	8	11.00	2025-10-11 15:46:19.928494+00	2025-10-11 15:46:19.928494+00
70d6f6ef-f5b1-406c-82f1-e965b6c5c2af	65488a20-8185-4f04-84cb-024b4e1f4e23	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	22.50	2025-10-11 16:02:58.58206+00	2025-10-11 16:02:58.58206+00
6903b704-d3d7-4763-98f3-2090ac12a86d	65488a20-8185-4f04-84cb-024b4e1f4e23	74189eb6-43ae-4aae-842e-accc38d9d823	2	8	22.50	2025-10-11 16:03:07.047744+00	2025-10-11 16:03:07.047744+00
b3eb5cd6-b4b7-4025-a713-12ef36e3c589	65488a20-8185-4f04-84cb-024b4e1f4e23	74189eb6-43ae-4aae-842e-accc38d9d823	3	8	22.50	2025-10-11 16:03:12.760424+00	2025-10-11 16:03:12.760424+00
a31c45c2-7ec7-4a4d-8931-348acdb387bf	65488a20-8185-4f04-84cb-024b4e1f4e23	027ae547-6764-4244-a16d-f4dde6df985e	1	10	12.00	2025-10-11 16:03:17.633867+00	2025-10-11 16:03:17.633867+00
388c7200-12f5-4819-8127-8f851349a927	65488a20-8185-4f04-84cb-024b4e1f4e23	027ae547-6764-4244-a16d-f4dde6df985e	2	10	12.00	2025-10-11 16:03:22.106856+00	2025-10-11 16:03:22.106856+00
023b57c3-4da4-4246-8379-e4391887c312	65488a20-8185-4f04-84cb-024b4e1f4e23	027ae547-6764-4244-a16d-f4dde6df985e	3	10	12.00	2025-10-11 16:03:27.207443+00	2025-10-11 16:03:27.207443+00
cd0c9dcc-11c5-4cfb-bb59-766f26d72203	fb31bc60-dd0d-470c-92e0-d6f782dce1db	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	8.50	2025-10-11 16:08:27.817804+00	2025-10-11 16:08:27.817804+00
6d66a298-69c0-4027-91df-a7ba83fbc51f	fb31bc60-dd0d-470c-92e0-d6f782dce1db	74189eb6-43ae-4aae-842e-accc38d9d823	2	8	13.00	2025-10-11 16:08:31.949294+00	2025-10-11 16:08:31.949294+00
d00fb500-26d5-4568-b545-4e4c2625ccdb	29230412-e805-40e5-96d7-675d070cfe01	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	13.50	2025-10-11 16:16:47.581745+00	2025-10-11 16:16:47.581745+00
7cd9127e-e8ef-4510-a2f2-e65925d406b9	29230412-e805-40e5-96d7-675d070cfe01	74189eb6-43ae-4aae-842e-accc38d9d823	2	8	11.50	2025-10-11 16:16:52.184499+00	2025-10-11 16:16:52.184499+00
d34295ba-1cdd-4933-919c-a8dbba7b2c6c	29230412-e805-40e5-96d7-675d070cfe01	74189eb6-43ae-4aae-842e-accc38d9d823	3	8	7.00	2025-10-11 16:16:55.464454+00	2025-10-11 16:16:55.464454+00
8e6a9700-12f8-4e99-a222-a106bdcafb08	3ddbac9e-e5d4-4573-8ef7-e34c765c06f1	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	1	8	22.50	2025-10-12 15:36:25.188965+00	2025-10-12 15:36:25.188965+00
796f739a-5e79-473b-bec4-4f8ac2991863	3ddbac9e-e5d4-4573-8ef7-e34c765c06f1	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	2	8	22.00	2025-10-12 15:37:13.733968+00	2025-10-12 15:37:13.733968+00
898d7286-2e2c-4cd7-bcc1-2842a3f7aba0	3ddbac9e-e5d4-4573-8ef7-e34c765c06f1	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	3	8	22.00	2025-10-12 15:37:19.434428+00	2025-10-12 15:37:19.434428+00
64ac3195-5237-4bc6-899e-38c1e0859e8d	68a7c504-9d0c-4d8f-960e-4ae02421afdd	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	1	8	22.00	2025-10-12 19:22:40.359186+00	2025-10-12 19:22:40.359186+00
403d6f2c-555d-4a24-8652-b4ec552c5452	c9c27f41-6a40-4bc3-a316-15363a4db368	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	1	8	22.50	2025-10-13 12:21:57.027572+00	2025-10-13 12:21:57.027572+00
8c4b4cce-705d-4eef-a1d2-99ce5b327216	76ed8d73-d363-4642-be1a-fd993fd27ee5	74189eb6-43ae-4aae-842e-accc38d9d823	1	8	22.00	2025-10-13 19:50:32.104984+00	2025-10-13 19:50:32.104984+00
c6d7424d-497c-42c1-94f2-8c0e58cbe23e	76ed8d73-d363-4642-be1a-fd993fd27ee5	74189eb6-43ae-4aae-842e-accc38d9d823	2	8	22.00	2025-10-13 19:50:40.653911+00	2025-10-13 19:50:40.653911+00
d689a7ba-9e6f-43ed-acb5-577975453b4b	76ed8d73-d363-4642-be1a-fd993fd27ee5	74189eb6-43ae-4aae-842e-accc38d9d823	3	8	22.00	2025-10-13 19:50:43.7522+00	2025-10-13 19:50:43.7522+00
4b72f516-a273-417c-b1cb-09442eb89752	1a79af7c-e6b2-4663-bddc-7dc11be72cc3	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	1	8	22.00	2025-10-15 15:52:40.813641+00	2025-10-15 15:52:40.813641+00
f7eeb469-e414-4c97-844f-308f41cd3d6a	1a79af7c-e6b2-4663-bddc-7dc11be72cc3	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	2	8	22.00	2025-10-15 15:52:55.0495+00	2025-10-15 15:52:55.0495+00
dbab3a2b-3816-4d5e-8484-febe9a641d15	1a79af7c-e6b2-4663-bddc-7dc11be72cc3	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	3	8	22.00	2025-10-15 15:52:58.374572+00	2025-10-15 15:52:58.374572+00
0c197a8e-acd9-4ca8-9935-7e0194e9b9d9	1a79af7c-e6b2-4663-bddc-7dc11be72cc3	6ccf6b27-5248-4ab0-bc75-6429001b8040	1	12	17.00	2025-10-15 15:53:02.928593+00	2025-10-15 15:53:02.928593+00
49455e03-cf51-4111-b953-c39b1099b7ba	1a79af7c-e6b2-4663-bddc-7dc11be72cc3	6ccf6b27-5248-4ab0-bc75-6429001b8040	2	12	17.00	2025-10-15 15:53:06.484341+00	2025-10-15 15:53:06.484341+00
e4fff20d-61d9-4ac7-8545-b1ad20a02d69	1a79af7c-e6b2-4663-bddc-7dc11be72cc3	6ccf6b27-5248-4ab0-bc75-6429001b8040	3	12	17.00	2025-10-15 15:53:09.51269+00	2025-10-15 15:53:09.51269+00
4f4239ec-80bb-481e-bb55-2e47adf5bd29	d661538f-c88f-4eed-8e9f-e16d45bcc384	1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	1	8	22.00	2025-10-17 10:44:48.520234+00	2025-10-17 10:44:48.520234+00
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, user_id, display_name, avatar_emoji, level, xp_total, stat_force, stat_endurance, stat_agilite, stat_mental, created_at, updated_at) FROM stdin;
20898b0f-dded-4254-8740-b5e5fcf64040	7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2	Nouvel Athlète	🧑‍💻	0	0	0	0	0	0	2025-09-04 21:38:05.589358+00	2025-09-04 21:38:05.589358+00
d0d86c8c-dceb-4fdb-90a1-59a222b0e6ee	cb55410e-aeef-46e9-ba41-52dfc34005e0	Nouvel Athlète	🧑‍💻	0	0	0	0	0	0	2025-09-08 19:21:12.550839+00	2025-09-08 19:21:12.550839+00
fe3066e7-1f1a-4c11-8594-a5a3d569f353	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	Nouvel Athlète	🧑‍💻	6	7488	361	255	178	134	2025-09-03 00:28:06.138284+00	2025-09-03 00:28:06.138284+00
\.


--
-- Data for Name: quest_exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quest_exercises (id, quest_id, order_index, name, target_reps, notes, created_at, sets_count, target_weight, rest_seconds) FROM stdin;
b86f891e-091a-4e9f-8074-6086b5be5f17	cd505854-0676-4947-8d96-0dbe3b21da3b	1	Air Squat	12	\N	2025-09-03 20:27:22.305171+00	3	\N	60
1d3cbea6-2877-423e-a688-c2498636f900	cd505854-0676-4947-8d96-0dbe3b21da3b	2	Pompes	10	\N	2025-09-03 20:27:22.305171+00	3	\N	60
3d0187c3-c134-4f06-818d-6dd6af46ad5f	cd505854-0676-4947-8d96-0dbe3b21da3b	3	Sit-up	5	\N	2025-09-08 16:48:57.772413+00	3	\N	60
ce7712ae-f13e-49be-9f46-5bc73604164f	22dcb6e7-2a81-4033-9bda-b792ec56bf79	1	aaaavvvvvv	2	\N	2025-09-08 21:00:43.646057+00	3	\N	60
3fccaf8b-7452-4da8-891f-a8a51fa0adb7	0a59640d-d3ad-4e73-baf6-c9f6757f4937	1	test	4	test	2025-09-08 17:35:51.556381+00	3	\N	60
1b8174b4-bc53-40b1-9b2e-969054fc2621	0a59640d-d3ad-4e73-baf6-c9f6757f4937	2	test2333	3	test	2025-09-08 17:35:51.556381+00	3	\N	60
6a1d43b0-886f-4d5c-8ec6-87ac4a6fd996	59ae035b-4725-45bc-89d9-90acbe8eb691	1	Courir	0	\N	2025-09-09 10:34:29.967727+00	3	\N	60
52d82414-4354-4f16-b457-d6d5050cae1f	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	1	Pompes	10	test	2025-10-09 11:54:29.985822+00	3	\N	60
897da51e-57e3-4f64-9f45-887bfd7bca4a	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	2	Abdos	15	\N	2025-10-09 11:54:29.985822+00	3	\N	60
d10a8498-bf5c-4789-a218-4c5e57b03ca2	1fc7be30-7281-45f8-92ef-317256d025c9	1	Pompes	0	\N	2025-10-09 11:56:50.357841+00	3	\N	60
9ac0bec4-a3b2-4664-97a3-1547b3a7c128	35c3ffdc-3c54-422a-84e1-cd9ab09bbb3a	1	Squats	12	\N	2025-09-03 20:27:22.305171+00	3	\N	60
567ec94a-6bbb-4ab3-b72f-e613777bee2e	35c3ffdc-3c54-422a-84e1-cd9ab09bbb3a	2	Pompes	10	\N	2025-09-03 20:27:22.305171+00	3	\N	60
e47daa14-accc-43a1-87e6-d4d853c0a6e7	5ec3cffb-1479-4256-ae96-923c0e914848	1	Squats	10	\N	2025-09-03 20:27:22.305171+00	3	\N	60
08f20380-a914-4380-90ec-93caded76a08	5ec3cffb-1479-4256-ae96-923c0e914848	2	Pompes	10	\N	2025-09-03 20:27:22.305171+00	3	\N	60
394723e7-9b62-457f-a87a-3e53f95c0fff	056391cc-932a-479c-b67d-c0013c792b2b	1	Jumping jacks	0	\N	2025-09-03 20:27:22.305171+00	3	\N	60
972b85ae-34ec-4d28-9bc3-182c78888b46	056391cc-932a-479c-b67d-c0013c792b2b	2	Air squats	0	\N	2025-09-03 20:27:22.305171+00	3	\N	60
6409e33f-8cbd-4d74-b919-7aa86730e19f	056391cc-932a-479c-b67d-c0013c792b2b	3	Push-ups	0	\N	2025-09-03 20:27:22.305171+00	3	\N	60
26305727-8fa6-42e0-94b3-810fce7b7531	056391cc-932a-479c-b67d-c0013c792b2b	4	Sit-ups	0	\N	2025-09-03 20:27:22.305171+00	3	\N	60
fa9d4d40-d338-40c8-84d7-892e46cb0b08	c2e70066-5dc2-4e6f-b9dd-54356007fdff	1	Squats haltères	10	\N	2025-09-03 20:27:22.305171+00	3	\N	60
7d07b8a6-62b2-46fe-b705-19df237a76f6	c2e70066-5dc2-4e6f-b9dd-54356007fdff	2	Pompes	10	\N	2025-09-03 20:27:22.305171+00	3	\N	60
718886b6-f74f-4ce1-bb04-cbe9f5361122	c2e70066-5dc2-4e6f-b9dd-54356007fdff	3	Sit-ups	10	\N	2025-09-03 20:27:22.305171+00	3	\N	60
0234f5a3-e10a-434d-b359-b534d5d7a834	1fc7be30-7281-45f8-92ef-317256d025c9	2	Abdos	0	\N	2025-10-09 11:56:50.357841+00	3	\N	60
74189eb6-43ae-4aae-842e-accc38d9d823	cc31a775-a249-4c02-9415-6eba4e4818b6	1	Développé couché	8	\N	2025-10-10 17:20:22.148935+00	3	\N	60
027ae547-6764-4244-a16d-f4dde6df985e	cc31a775-a249-4c02-9415-6eba4e4818b6	2	Développé militaire assis	10	\N	2025-10-10 17:20:22.148935+00	3	\N	60
94a01a5a-8516-4219-b0c4-adfa52fe757f	981969b7-6d3c-45ed-b4e4-473367df335e	1	Rowing	12	\N	2025-09-07 10:59:12.289806+00	3	\N	60
2d5473b6-03f0-4c12-8082-5aed172d34e8	981969b7-6d3c-45ed-b4e4-473367df335e	2	Push up	12	\N	2025-09-07 10:59:12.289806+00	3	\N	60
332aa46d-bb1d-471e-801c-eea742b54662	981969b7-6d3c-45ed-b4e4-473367df335e	3	Sit up	12	\N	2025-09-07 10:59:12.289806+00	3	\N	60
277ce1e8-8556-4d95-b344-8d373446a63b	981969b7-6d3c-45ed-b4e4-473367df335e	4	Air squat jump	12	\N	2025-09-07 10:59:12.289806+00	3	\N	60
7cfdafa8-7172-4de9-a60b-8a0ab1c90fdf	981969b7-6d3c-45ed-b4e4-473367df335e	5	Burpees	12	\N	2025-09-07 10:59:12.289806+00	3	\N	60
1407cdb3-6b68-4695-ac2e-8e6f6c2ad1b1	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	1	Développé couché	8	\N	2025-10-10 23:59:48.874166+00	3	\N	60
6ccf6b27-5248-4ab0-bc75-6429001b8040	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	2	Elévations latérales	12	\N	2025-10-10 23:59:48.874166+00	3	\N	60
\.


--
-- Data for Name: quests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quests (id, campaign_id, order_index, title, description, type, xp_force, xp_endurance, xp_agilite, xp_mental, xp_total, workout_type, work_seconds, rest_seconds, rounds_target, total_minutes, created_at, level_required, equipment_tags, estimated_duration_minutes, is_one_shot, is_published, rest_time_seconds, sets_count) FROM stdin;
35c3ffdc-3c54-422a-84e1-cd9ab09bbb3a	b38309ee-b9df-45bb-a2d5-07b16f7b97f2	2	Découverte des supersets	Ton premier superset : squats + pompes enchaînés.	quete	30	10	5	5	50	for_time	0	0	3	0	2025-09-03 20:26:49.921058+00	\N	\N	30	f	t	60	3
5ec3cffb-1479-4256-ae96-923c0e914848	b38309ee-b9df-45bb-a2d5-07b16f7b97f2	3	Mini Boss – 3 rounds squats & pompes	3 rounds de 10 squats + 10 pompes (chronométré).	boss	20	15	5	10	50	for_time	0	0	3	0	2025-09-03 20:26:49.921058+00	\N	\N	30	f	t	60	3
056391cc-932a-479c-b67d-c0013c792b2b	b38309ee-b9df-45bb-a2d5-07b16f7b97f2	4	HIIT débutant 4×20sec	Jumping jacks, air squats, push-up, sit-ups (4×20s / 10s repos).	quete	10	30	10	10	60	tabata	20	10	4	0	2025-09-03 20:26:49.921058+00	\N	\N	30	f	t	60	3
c2e70066-5dc2-4e6f-b9dd-54356007fdff	b38309ee-b9df-45bb-a2d5-07b16f7b97f2	6	Boss Final – Dungeon Challenge (15 min for time)	Pendant 15 min : 10 squats haltères, 10 pompes, 10 sit-ups (max tours).	boss	40	40	20	20	120	amrap	0	0	0	15	2025-09-03 20:26:49.921058+00	\N	\N	30	f	t	60	3
981969b7-6d3c-45ed-b4e4-473367df335e	f582bde3-d07e-4613-926d-0968c50a1222	1	HIIT full body	HIIT full body de niveau avancé	quete	5	5	5	5	20	amrap	0	0	0	28	2025-09-07 10:59:12.143048+00	BEGINNER	{POIDS_CORPS}	30	f	t	60	3
cd505854-0676-4947-8d96-0dbe3b21da3b	b38309ee-b9df-45bb-a2d5-07b16f7b97f2	1	Eveil du corps 	Circuit doux et continu pour transpirer sans s’exploser	quete	5	5	5	10	25	amrap	0	0	0	20	2025-09-03 20:26:49.921058+00	BEGINNER	{POIDS_CORPS}	20	t	t	60	3
22dcb6e7-2a81-4033-9bda-b792ec56bf79	7d881dbe-51a4-4a44-8ee2-66e48837defa	2	aaaaa	aaaaa	boss	0	0	0	0	0	simple	0	0	0	0	2025-09-08 21:00:43.582331+00	BEGINNER	{}	30	f	t	60	3
0a59640d-d3ad-4e73-baf6-c9f6757f4937	7d881dbe-51a4-4a44-8ee2-66e48837defa	1	Quete test	Test de quête de boss	boss	0	0	0	0	0	amrap	0	0	0	30	2025-09-08 17:35:51.463889+00	INTERMEDIATE	{BARRE,POIDS_CORPS,KETTLEBELL}	30	f	t	60	3
59ae035b-4725-45bc-89d9-90acbe8eb691	f582bde3-d07e-4613-926d-0968c50a1222	2	Test Cooper	Courir 12 min le plus rapidement possible 	boss	0	10	0	0	10	simple	0	0	0	12	2025-09-09 10:34:29.83837+00	INTERMEDIATE	{}	11	t	t	60	3
232a6baf-8e71-42e2-bc2b-f4beb1e80b83	8d451310-21ef-4a65-bd1c-4ea7f2a4e1de	1	Test quête 1	test quête 1	quete	3	2	2	2	9	simple	0	0	0	20	2025-10-09 11:54:29.887068+00	INTERMEDIATE	{POIDS_CORPS,HALTERES}	30	t	t	60	3
1fc7be30-7281-45f8-92ef-317256d025c9	8d451310-21ef-4a65-bd1c-4ea7f2a4e1de	2	Test quête 2	Test quête 2 version Tabata	quete	4	3	2	2	11	tabata	10	20	0	11	2025-10-09 11:56:50.240845+00	INTERMEDIATE	{POIDS_CORPS,HALTERES}	30	t	t	60	3
cc31a775-a249-4c02-9415-6eba4e4818b6	7d881dbe-51a4-4a44-8ee2-66e48837defa	3	Test séance musculation	Première séance de musculation créé suuuuuuuuu	quete	20	5	0	5	30	strength	0	0	0	58	2025-10-10 17:20:22.072177+00	INTERMEDIATE	{HALTERES,BANC,BARRE}	60	t	t	60	3
1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	7d881dbe-51a4-4a44-8ee2-66e48837defa	1	Musculation V2	Musculation V2	quete	5	2	1	0	8	strength	0	0	0	30	2025-10-10 23:59:48.789451+00	INTERMEDIATE	{HALTERES,BANC}	30	t	t	60	3
\.


--
-- Data for Name: session_rounds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session_rounds (id, session_id, round_no, duration_seconds, reps_total, created_at) FROM stdin;
7850dfa9-1db0-4a29-9c4f-e6d6b6b94a71	ca7cc8d5-cba7-45b9-be07-d4d5cebe8345	1	4	37	2025-09-04 00:41:56.161448+00
14007ff3-a979-4277-8a2d-9169ecaeb2e1	ca7cc8d5-cba7-45b9-be07-d4d5cebe8345	2	2	37	2025-09-04 00:41:58.21305+00
9d1065cd-0cf4-4438-a3b8-52cf8108485c	ca7cc8d5-cba7-45b9-be07-d4d5cebe8345	3	2	37	2025-09-04 00:42:00.118233+00
c17e9be3-f2ec-46f8-bd72-1ec071715461	e4b54ca8-c1df-4072-8798-1838e07ff3d1	1	3	22	2025-09-04 00:42:29.58045+00
173bd792-07ba-4b4d-b319-7d8c2ec24bd7	e4b54ca8-c1df-4072-8798-1838e07ff3d1	2	1	22	2025-09-04 00:42:30.497677+00
90de5c7a-67b6-4f2f-b2de-8555369271c9	e4b54ca8-c1df-4072-8798-1838e07ff3d1	3	1	22	2025-09-04 00:42:31.119449+00
7acc7aa0-c47c-42d2-8e0f-6565fab451a0	e4b54ca8-c1df-4072-8798-1838e07ff3d1	3	7	22	2025-09-04 01:48:07.281574+00
54dd60b2-7d86-444d-8351-4d50133db2b8	e4b54ca8-c1df-4072-8798-1838e07ff3d1	4	5	22	2025-09-04 01:48:12.749382+00
1ad8ff68-01af-451f-98cd-f0bf7415e9ca	e4b54ca8-c1df-4072-8798-1838e07ff3d1	5	1	22	2025-09-04 01:48:13.884602+00
9ad57c9a-3067-4e49-8c06-40b65357f103	2c73e6f3-fe8a-4130-b9bd-5d7a1447a24a	1	5	20	2025-09-04 10:09:40.156538+00
833be8a5-96c4-4b1d-b6b1-1d49e83b7486	2c73e6f3-fe8a-4130-b9bd-5d7a1447a24a	2	2	20	2025-09-04 10:16:19.599081+00
2a553cf1-b21f-4f63-9d32-64ee18704057	2c73e6f3-fe8a-4130-b9bd-5d7a1447a24a	3	3	20	2025-09-04 10:16:24.672358+00
b6526b35-04cf-46bc-9dde-6152066d0959	2c73e6f3-fe8a-4130-b9bd-5d7a1447a24a	4	1	20	2025-09-04 10:16:25.597137+00
47ed461a-d9a4-4360-a499-cd8c138f4c73	2c73e6f3-fe8a-4130-b9bd-5d7a1447a24a	5	1	20	2025-09-04 10:16:25.935524+00
e7eb3819-f4a2-406f-9818-26a37d449b6b	2c73e6f3-fe8a-4130-b9bd-5d7a1447a24a	6	13	20	2025-09-05 00:12:39.367444+00
495f73ba-f220-427b-8a00-e7ad77f7cb0a	2c73e6f3-fe8a-4130-b9bd-5d7a1447a24a	7	0	20	2025-09-05 00:12:40.678082+00
295be1da-7387-417e-adfb-8a2c73838778	2c73e6f3-fe8a-4130-b9bd-5d7a1447a24a	8	0	20	2025-09-05 00:12:40.989237+00
2524a2e1-756c-4164-830d-f55a4f9543d3	bbdec741-1b00-43ee-93fc-01a50eadbefc	1	4	0	2025-09-06 20:48:21.419012+00
8700ddff-0855-41a6-b6fb-316dbc91f7ae	bbdec741-1b00-43ee-93fc-01a50eadbefc	2	2	0	2025-09-06 20:48:22.83902+00
6399fbba-a3fe-46c9-beb3-b51fc384b131	c94df645-399d-4338-991d-62b5e79d308e	1	2	27	2025-09-08 21:27:28.454647+00
ba679165-8071-457f-9824-5bd4e1fabecb	c94df645-399d-4338-991d-62b5e79d308e	2	0	27	2025-09-08 21:27:28.602938+00
92d7be2c-a01a-4976-ba30-3554928d408e	22b3ebd1-95f5-4164-95f5-85ceb77024bb	1	6	27	2025-09-08 21:28:21.825933+00
0fb7e1ce-7a63-4c2d-9a79-8a965c9fd4ea	22b3ebd1-95f5-4164-95f5-85ceb77024bb	2	2	27	2025-09-08 21:28:23.842783+00
86fcac5b-37a3-4fe9-9faf-3e5ad7667517	5635dc8b-42ff-438c-a4c2-7ac21ead5fce	1	8	27	2025-09-08 21:31:17.799368+00
27bf3ccf-9b49-4dc6-9a82-c761f4a1b15b	1710ba48-b027-4a98-a83b-7397ae462205	1	2	60	2025-09-08 21:32:42.680759+00
41ef4752-f1e3-462e-b489-301042c49048	1710ba48-b027-4a98-a83b-7397ae462205	2	1	60	2025-09-08 21:32:43.541125+00
c4cdd31f-7b83-4666-801a-91b00d33947b	e14447ba-9b1d-499c-bc31-ff42b87317e9	1	4	27	2025-09-08 21:33:41.640929+00
480a65a8-ba22-4b05-a91c-908fdfb099da	e14447ba-9b1d-499c-bc31-ff42b87317e9	2	0	27	2025-09-08 21:33:42.401842+00
928932cc-5a49-436a-acd0-6e23a9835d76	b7564972-27ce-4aed-acbd-480acddc882e	1	6	60	2025-09-08 21:38:02.219143+00
1a43a717-e0ee-41f7-a88a-8c0097222b41	b7564972-27ce-4aed-acbd-480acddc882e	2	2	60	2025-09-08 21:38:04.385466+00
77a0dffa-e464-4a9e-aadb-6671e10bb607	b7564972-27ce-4aed-acbd-480acddc882e	3	1	60	2025-09-08 21:38:05.41209+00
ba8f5c34-548f-4792-aeb8-e447436d82e0	019031bf-fdc8-4928-adab-b2e87cbaa50f	1	4	60	2025-09-08 21:41:08.213457+00
4e5ce9c8-698f-479b-ab0a-be670b2e6e5c	019031bf-fdc8-4928-adab-b2e87cbaa50f	2	1	60	2025-09-08 21:41:08.998477+00
d55ff6d6-aa67-4d3c-8712-969381402b10	8edca669-e341-4e09-afab-bf78347923fb	1	2	60	2025-09-08 21:50:02.036908+00
b8137734-c5dc-4afb-a6c1-74c4d21be7b7	8edca669-e341-4e09-afab-bf78347923fb	2	3	60	2025-09-08 21:50:04.419316+00
6c8f6d11-bd9f-4f9f-83d8-d1eb6c10d5fa	8edca669-e341-4e09-afab-bf78347923fb	3	1	60	2025-09-08 21:50:05.202166+00
3b5701d6-34f3-4051-9ae7-06d7509ebdc8	87cedad7-9c02-462c-920b-b0b0639fe84a	1	7	27	2025-09-08 21:50:35.109328+00
1ab10676-c61d-4b0d-baf0-74fc5a9b1e7c	87cedad7-9c02-462c-920b-b0b0639fe84a	2	1	27	2025-09-08 21:50:36.26205+00
5593bbb1-9120-4eac-a4ee-e1e04cf2a9fb	87cedad7-9c02-462c-920b-b0b0639fe84a	3	1	27	2025-09-08 21:50:37.00986+00
74fe2806-446b-4015-8558-8390bede8034	0924fa20-5828-4ec8-8f18-e80b71bf7f9c	1	5	27	2025-09-08 21:53:08.922054+00
31ee5c24-b1a2-475d-8cf9-c30e84fa793c	0924fa20-5828-4ec8-8f18-e80b71bf7f9c	2	2	27	2025-09-08 21:53:10.350914+00
a5214f03-d2eb-4188-8dce-011cfaf8c6af	0924fa20-5828-4ec8-8f18-e80b71bf7f9c	3	0	27	2025-09-08 21:53:11.190133+00
54a6a041-ccc8-4f26-b683-bebf1e11de2f	dd840004-0b5f-491f-97ad-7c73c42be12b	1	4	27	2025-09-08 21:55:37.200285+00
d52b13ae-3d0c-46e1-8e9f-192233cb17b5	dd840004-0b5f-491f-97ad-7c73c42be12b	2	0	27	2025-09-08 21:55:37.766354+00
95566d7f-4cb3-490b-958e-17a2913e4631	dd840004-0b5f-491f-97ad-7c73c42be12b	3	1	27	2025-09-08 21:55:38.321008+00
8d7e6cc4-55be-4e1e-a3ee-fbfdb236e79b	89892f76-08f1-468a-b2f8-3e137dd09197	1	3	27	2025-09-08 21:57:57.51843+00
97a12fe3-04b5-424a-bc62-89a0a51bf0d6	89892f76-08f1-468a-b2f8-3e137dd09197	2	1	27	2025-09-08 21:57:57.957355+00
50602f22-7607-4851-9858-23967371ad05	6350e598-4b75-46db-8c6f-544d61d59ceb	1	6	27	2025-09-08 21:58:46.635476+00
63dc0c06-dad8-464a-8c0e-8b804633e778	6350e598-4b75-46db-8c6f-544d61d59ceb	2	0	27	2025-09-08 21:58:47.37806+00
bb7203c0-61c7-41d2-998a-e01f8e427ad7	59465056-0a0b-49c2-ac1b-e6741a4758c8	1	8	27	2025-09-08 22:02:08.448955+00
834c6e65-6c57-4b97-b908-36c4acb9501e	59465056-0a0b-49c2-ac1b-e6741a4758c8	2	3	27	2025-09-08 22:02:11.340171+00
9c92dcda-9a4a-40af-9db1-69ea833cf9ed	9b96a132-f9b9-4a8e-a950-5b1bb5364aa3	1	4	27	2025-09-08 22:02:51.758906+00
829cb8b4-aa86-44b0-b6bf-9d4e4ad9b486	9b96a132-f9b9-4a8e-a950-5b1bb5364aa3	2	2	27	2025-09-08 22:02:53.516338+00
bcc87fd1-ed4a-43a7-89d1-404ac1756cb8	9b96a132-f9b9-4a8e-a950-5b1bb5364aa3	3	1	27	2025-09-08 22:02:54.419989+00
5170a776-f7d8-44e2-8013-bafc6405cf47	dc4320ef-0319-466e-a74b-9a8a14a6bedb	1	4	27	2025-09-08 22:04:45.246048+00
da7d9e5f-bca2-4a23-9474-2ee5aebc3051	dc4320ef-0319-466e-a74b-9a8a14a6bedb	2	2	27	2025-09-08 22:04:46.98097+00
0e54bcf3-1bc1-4117-b8e8-cc0541f8faa3	dc4320ef-0319-466e-a74b-9a8a14a6bedb	3	1	27	2025-09-08 22:04:47.830637+00
913d2e5a-96dd-442b-b94b-a231e2697a67	1e2ac4e1-afd5-4716-b17d-d741b47e1640	1	4	27	2025-09-08 22:07:28.278609+00
10e2f93c-6bfa-48e7-96e3-0aef305d6d04	1e2ac4e1-afd5-4716-b17d-d741b47e1640	2	2	27	2025-09-08 22:07:30.649696+00
6a93d7aa-db04-488b-9c00-10cf84f7afbf	1e2ac4e1-afd5-4716-b17d-d741b47e1640	3	1	27	2025-09-08 22:07:31.509145+00
060967c9-2cad-486b-9b5c-607c40e44f81	c5dc6468-6394-4a68-8fed-2b664c799c4b	1	4	27	2025-09-08 22:09:52.428194+00
44a2665d-5a27-440f-9def-0fff84530d08	c5dc6468-6394-4a68-8fed-2b664c799c4b	2	2	27	2025-09-08 22:09:54.184695+00
0867f484-a3a2-4c4e-844a-7ce18088209e	9394e066-3269-43ec-bd28-16927918cfe3	1	5	27	2025-09-08 22:11:38.13023+00
e41dc60e-82d2-406a-b50c-639e0bac1749	9394e066-3269-43ec-bd28-16927918cfe3	2	2	27	2025-09-08 22:11:39.835443+00
4fad3cde-21fa-4199-9e3b-4f7e78f82547	bbdec741-1b00-43ee-93fc-01a50eadbefc	2	14	0	2025-09-08 22:12:04.680947+00
3faa8a31-0e1a-4244-b09e-522672b4688d	bbdec741-1b00-43ee-93fc-01a50eadbefc	3	1	0	2025-09-08 22:12:05.090847+00
c948501e-c338-417a-976b-0d0a03de01f2	bbdec741-1b00-43ee-93fc-01a50eadbefc	4	0	0	2025-09-08 22:12:05.480994+00
995ac397-2f50-425c-9143-96d49dff90a3	4ac0a709-ec18-47ae-a748-bdc7d9f5056e	1	6	27	2025-09-09 10:22:13.439053+00
b57ef6d0-6cb2-4f02-9099-a6a102915af2	4ac0a709-ec18-47ae-a748-bdc7d9f5056e	2	3	27	2025-09-09 10:22:16.450047+00
ce6707f7-fc5f-4c98-bfec-9c08a543c7b1	4ac0a709-ec18-47ae-a748-bdc7d9f5056e	3	2	27	2025-09-09 10:22:18.268759+00
a64eb11d-5f14-430c-8e0e-f8451a94f551	e8731da0-7820-4af1-b0db-441014ff6100	1	3	27	2025-09-09 10:26:20.644961+00
eb0d15f9-210d-46c4-877f-9d071b39724a	e8731da0-7820-4af1-b0db-441014ff6100	2	0	27	2025-09-09 10:26:21.459111+00
93079c27-3bc7-47c5-90d4-5a6a67480424	e8731da0-7820-4af1-b0db-441014ff6100	3	1	27	2025-09-09 10:26:22.09456+00
5792c38c-2daa-444a-936f-5e76fc30c0ec	9c93df71-c27f-438e-821b-e68b3995da36	1	8	27	2025-09-09 10:27:07.372266+00
5534f11d-5c22-47b0-bbcd-fb55c4dfb8cb	9c93df71-c27f-438e-821b-e68b3995da36	2	2	27	2025-09-09 10:27:08.986886+00
c10dae7b-8153-427a-970c-3606de0f9870	9c93df71-c27f-438e-821b-e68b3995da36	3	1	27	2025-09-09 10:27:09.712312+00
6678e580-00c0-4d80-900c-8776e523fb18	0d6bc5a6-a90c-431d-acb1-98011d5b48c0	1	4	60	2025-09-09 10:37:49.613384+00
0ae2be7c-abb1-4b34-98ee-fc742542bdfc	0d6bc5a6-a90c-431d-acb1-98011d5b48c0	2	1	60	2025-09-09 10:37:50.317022+00
9be713c0-efd5-454e-9efb-e25e1df6b7ee	0d6bc5a6-a90c-431d-acb1-98011d5b48c0	3	1	60	2025-09-09 10:37:50.980558+00
5b7e84c9-5977-4182-954e-8787447c5149	2865eabe-0b2b-4ef7-a146-7ea2ae3282f5	1	6	60	2025-09-09 10:44:01.209405+00
cc4bcca4-0240-4e26-8c92-b6a2e5e61730	2865eabe-0b2b-4ef7-a146-7ea2ae3282f5	2	1	60	2025-09-09 10:44:02.611659+00
8a931fcb-146d-4857-b8da-e2bba3825310	2865eabe-0b2b-4ef7-a146-7ea2ae3282f5	3	1	60	2025-09-09 10:44:03.308661+00
e1396341-bbf3-45f9-a987-51a39e7b6da6	b68230a5-b006-4c79-aa99-00e5d135111e	1	5	60	2025-09-09 10:48:33.319975+00
9ed79b89-483c-47a1-b188-290bc8a48f7f	b68230a5-b006-4c79-aa99-00e5d135111e	2	2	60	2025-09-09 10:48:35.347247+00
b89ca3fa-5f2a-4ce3-83f1-a74a91019f5b	b68230a5-b006-4c79-aa99-00e5d135111e	3	1	60	2025-09-09 10:48:36.420075+00
2721075c-cc17-43a2-8d69-44cc881fa6eb	05b6784e-6f6e-4a0e-8dfe-55aa57b9d828	1	13	60	2025-09-10 10:37:43.433271+00
b8e68852-14b3-4ca8-a268-582972f1c3f2	05b6784e-6f6e-4a0e-8dfe-55aa57b9d828	2	1	60	2025-09-10 10:37:44.312613+00
1d292898-e754-4bab-b561-11ffc6aa1570	05b6784e-6f6e-4a0e-8dfe-55aa57b9d828	3	1	60	2025-09-10 10:37:45.152587+00
8708d182-42f3-46d0-84c2-f4c18dd47a0b	05b6784e-6f6e-4a0e-8dfe-55aa57b9d828	4	1	60	2025-09-10 10:37:45.710504+00
5e684505-3f38-4e3e-bbf2-3b057d29c78a	38a3df3d-a4eb-44de-ae3d-8ff386f20b78	1	2	60	2025-09-10 10:43:07.840891+00
b49e89c8-2b79-4451-babd-e87bc6fca979	38a3df3d-a4eb-44de-ae3d-8ff386f20b78	2	1	60	2025-09-10 10:43:08.757246+00
49bf48bc-2340-4a6a-9776-4a161ac46849	38a3df3d-a4eb-44de-ae3d-8ff386f20b78	3	0	60	2025-09-10 10:43:09.309379+00
6880af45-1bc3-4666-a46d-beb733c07624	38a3df3d-a4eb-44de-ae3d-8ff386f20b78	4	1	60	2025-09-10 10:43:09.747247+00
2ef0fac6-8b1a-488d-be5f-e788eea53a6b	ae69d513-3038-48e0-89d1-8da7063b1086	1	4	60	2025-09-10 10:45:46.124926+00
7cbecddc-0c7f-431d-8c3f-231110023511	ae69d513-3038-48e0-89d1-8da7063b1086	2	0	60	2025-09-10 10:45:46.931104+00
83ec7845-84c3-44bb-a575-ac2568a4190e	ae69d513-3038-48e0-89d1-8da7063b1086	3	1	60	2025-09-10 10:45:47.504684+00
34bc801c-2134-4730-91bb-1c036bf9e497	ae69d513-3038-48e0-89d1-8da7063b1086	4	0	60	2025-09-10 10:45:47.962974+00
f2384082-93a3-4645-91d3-634e1b9c19cb	73c2b3e3-4988-43ce-ad96-20c5165d7c40	1	4	27	2025-09-10 21:56:26.675306+00
58bae1b9-e6ff-4add-a326-03dde2cf7c27	73c2b3e3-4988-43ce-ad96-20c5165d7c40	2	3	27	2025-09-10 21:56:29.576118+00
91296d8c-79f4-4bf5-a588-fd13ecb9b332	40b4e2f7-ebf1-4923-b9e9-c8e5838e0165	1	8	7	2025-09-11 23:13:28.651058+00
2f50a2a4-08a5-49c3-bc42-cfd06c46729d	40b4e2f7-ebf1-4923-b9e9-c8e5838e0165	2	0	7	2025-09-11 23:13:28.82051+00
212846fe-63a7-472a-a522-e6a6badfb9ea	40b4e2f7-ebf1-4923-b9e9-c8e5838e0165	3	1	7	2025-09-11 23:13:29.021854+00
526c5b03-e1e4-424f-8d3a-13a970b6504a	9a5bd99e-a49e-4cc0-a722-f956f850bfa5	1	7	60	2025-09-15 09:29:04.69658+00
eb7eb9fb-c330-4ea3-b73b-a1cfcc534502	9a5bd99e-a49e-4cc0-a722-f956f850bfa5	2	1	60	2025-09-15 09:29:05.538509+00
128a1538-c4ef-4af4-a241-4a8542f2f99a	9a5bd99e-a49e-4cc0-a722-f956f850bfa5	3	1	60	2025-09-15 09:29:06.40401+00
89e82882-27de-4c2a-8ad0-3b8385dcb844	19f665ee-8862-4d9b-9cf3-1bd753b67865	1	2	60	2025-09-15 09:29:58.84175+00
26ac54bf-e8b7-42a7-9cb7-7530f91d6427	19f665ee-8862-4d9b-9cf3-1bd753b67865	2	0	60	2025-09-15 09:29:59.230344+00
ee2c481e-6090-4c43-ae8c-9dedd35e4871	93bd0de5-16d0-4729-9b62-893a0dedc732	1	5	60	2025-09-15 09:32:20.429638+00
9fb30a97-8f0e-4c47-9fe5-7528b2917aef	93bd0de5-16d0-4729-9b62-893a0dedc732	2	1	60	2025-09-15 09:32:21.419125+00
f60ebd99-32f2-4bb6-b249-27fbb9d1a610	93bd0de5-16d0-4729-9b62-893a0dedc732	3	0	60	2025-09-15 09:32:21.991372+00
6e6028fa-2bae-4e84-9f8b-176cb4c1e34e	cd6329f6-b536-45ea-8681-9d3ed8611fcb	1	4	60	2025-09-15 09:34:11.343045+00
a8151d78-25d1-4fc8-baa7-8f4f4caeed90	cd6329f6-b536-45ea-8681-9d3ed8611fcb	2	1	60	2025-09-15 09:34:12.224267+00
98a3e831-73e4-47af-8acf-23101217f4ec	5d1a91af-9f5a-4bfd-9516-bdfbaae40acc	1	4	60	2025-09-15 09:35:18.494335+00
51d69bf1-f1f5-472a-86c8-23d408a2b829	5d1a91af-9f5a-4bfd-9516-bdfbaae40acc	2	1	60	2025-09-15 09:35:19.416042+00
73a9627d-6c2c-4284-9530-c6990b12ec54	747d5be6-925e-431a-acc5-fbd1f0caef6b	1	1	60	2025-09-15 09:36:56.05943+00
3871a11b-4902-4799-a598-37cf0becd015	747d5be6-925e-431a-acc5-fbd1f0caef6b	2	0	60	2025-09-15 09:36:56.174693+00
6daf43ee-93f4-423c-b7b7-a2cf745862ca	747d5be6-925e-431a-acc5-fbd1f0caef6b	3	0	60	2025-09-15 09:36:56.293368+00
6869d053-1b4a-43a6-8ec1-7b433df95edc	ce909c38-b180-49be-a427-c80d8d8609ee	1	9	60	2025-09-15 09:37:28.690364+00
a5bdd176-72b3-48f4-8d85-b68f2a0eafd6	ce909c38-b180-49be-a427-c80d8d8609ee	2	1	60	2025-09-15 09:37:29.006651+00
ed9d663b-3ae8-4e47-80ba-f008cbe57f2d	9f3326f3-10ab-47e4-a0aa-3afb3645bfe6	1	2	27	2025-09-15 20:54:30.028359+00
53ffb030-e023-49b8-882d-e0641f7aa81e	9f3326f3-10ab-47e4-a0aa-3afb3645bfe6	2	1	27	2025-09-15 20:54:30.408526+00
70b36868-9e2f-44eb-bbbd-129cd23d35c1	9f3326f3-10ab-47e4-a0aa-3afb3645bfe6	3	0	27	2025-09-15 20:54:30.972644+00
0f46de15-0439-4324-8999-c907901b6da0	10c5c33d-2a91-4ede-9b8d-bb90c30b951d	1	4	60	2025-09-22 13:44:13.741957+00
ce0d52a5-96e1-428a-8520-7c02fa5caffc	10c5c33d-2a91-4ede-9b8d-bb90c30b951d	2	1	60	2025-09-22 13:44:14.625539+00
d2f43a93-ad6d-4dce-b67d-38205ab3bc4d	915e81e9-8c23-4584-a46e-7ca957254d2f	1	5	60	2025-09-22 14:19:26.388786+00
db73b742-5e7e-426e-abf2-18e41864ad4b	915e81e9-8c23-4584-a46e-7ca957254d2f	2	1	60	2025-09-22 14:19:27.096455+00
5ef2e90e-db09-44fd-8baf-4d229b9863ac	e2f0f818-addb-4153-b204-1dba86d17d41	1	4	0	2025-09-23 12:48:37.719723+00
d24825ed-375a-4aa0-b572-adb89f40aa39	e2f0f818-addb-4153-b204-1dba86d17d41	2	1	0	2025-09-23 12:48:38.399266+00
0f9c8c60-a060-4776-b772-5836f2c52569	19064a64-9dad-400b-9b11-95a48d243c71	1	2	7	2025-09-23 13:03:41.480718+00
6d6ef23d-985e-4062-a815-2b94b6ded698	19064a64-9dad-400b-9b11-95a48d243c71	2	1	7	2025-09-23 13:03:42.315648+00
c82df4f2-b2d7-488a-9e49-10fcbab04bad	ca282e3f-dab5-4ffa-bcab-01154db9af7f	1	8	7	2025-10-09 11:43:13.300115+00
010cf939-524b-4fdc-a504-c42ddd739a4b	ca282e3f-dab5-4ffa-bcab-01154db9af7f	2	0	7	2025-10-09 11:43:14.546361+00
9ca96953-b5d2-44e7-b7bf-b6a9f4d9ef48	df11a829-fec9-45bf-9e43-f28d57082f1d	1	12	25	2025-10-09 11:59:04.505604+00
17e694bb-1d9e-44c0-8ac3-da0275ee54c2	df11a829-fec9-45bf-9e43-f28d57082f1d	2	1	25	2025-10-09 11:59:05.538676+00
313695a0-37b7-4ae5-aece-cdffd8b20a09	df11a829-fec9-45bf-9e43-f28d57082f1d	3	1	25	2025-10-09 11:59:06.832139+00
42b4eb40-a648-4582-849c-ca635b7fe8e6	3c20be46-593a-4a7a-aa3a-fba3bf998f8f	1	5	25	2025-10-10 10:19:17.577257+00
d18ee5da-e428-433f-8ae1-17c918d69c70	3c20be46-593a-4a7a-aa3a-fba3bf998f8f	2	3	25	2025-10-10 10:19:20.552435+00
0531de18-fc98-4e29-b47e-e5eaa460aa60	af8dc6de-9f04-4b67-be15-c79407412a59	1	5	25	2025-10-10 10:47:24.804452+00
f29e9bdd-114a-4160-a502-fb66774dc62d	af8dc6de-9f04-4b67-be15-c79407412a59	2	3	25	2025-10-10 10:47:27.204302+00
56f6c215-1701-4e81-a29f-e403c80bf4f9	3a5d6da8-2c74-4716-98b2-e331dfce2236	1	2	25	2025-10-10 23:24:57.551713+00
b47e2be7-350b-4097-994f-7e1690b80bc0	3a5d6da8-2c74-4716-98b2-e331dfce2236	2	1	25	2025-10-10 23:24:58.127354+00
274a94a0-6ecc-499e-9fc7-66f9af4ad3c1	3a5d6da8-2c74-4716-98b2-e331dfce2236	3	0	25	2025-10-10 23:24:58.994138+00
8e687488-09b1-4894-9c3e-311ce4090102	f48220ef-beb4-4979-ab92-21e4eedaae1a	1	9	7	2025-10-11 03:54:29.411146+00
7dc9223e-233e-4e09-9861-4eae498e9031	f48220ef-beb4-4979-ab92-21e4eedaae1a	2	7	7	2025-10-11 03:54:36.548475+00
\.


--
-- Data for Name: user_badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_badges (id, user_id, badge_id, unlocked_at) FROM stdin;
af97b3b6-0467-44d2-906e-77a636fcccff	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	3a0865d0-f718-4caa-9618-867179ae5c9c	2025-09-04 01:48:32.683924+00
59c16a69-39d0-43d4-bc1c-05a2cbc63462	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	88499474-23e8-4ed1-94e0-04927a2f6d04	2025-09-04 01:48:33.331959+00
\.


--
-- Data for Name: user_quests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_quests (id, user_id, quest_id, status, completed_at, created_at) FROM stdin;
a3bcd7b4-2fb4-42c3-ae0d-10d334d5c6d5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	c2e70066-5dc2-4e6f-b9dd-54356007fdff	locked	\N	2025-09-03 20:30:08.119882+00
d01ebc32-a1be-43b3-9d5a-34b476a2a6d3	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	0a59640d-d3ad-4e73-baf6-c9f6757f4937	completed	2025-10-11 15:38:52.298+00	2025-10-11 15:38:52.813409+00
21d863fb-ba87-4f5c-b507-2b89c7cfc574	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	35c3ffdc-3c54-422a-84e1-cd9ab09bbb3a	completed	2025-09-04 01:48:30.596+00	2025-09-03 20:30:08.119882+00
285683d9-36b1-4da2-b412-eda4505d7ef3	7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2	cd505854-0676-4947-8d96-0dbe3b21da3b	available	\N	2025-09-04 21:38:45.387993+00
d1c2763a-d63d-4385-bb5c-0be1e24f6fe2	7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2	35c3ffdc-3c54-422a-84e1-cd9ab09bbb3a	locked	\N	2025-09-04 21:38:45.387993+00
88eff050-d4cd-4905-af31-9c65d6514491	7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2	5ec3cffb-1479-4256-ae96-923c0e914848	locked	\N	2025-09-04 21:38:45.387993+00
e1ba48ad-edf6-4512-846e-25720da10b7d	7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2	056391cc-932a-479c-b67d-c0013c792b2b	locked	\N	2025-09-04 21:38:45.387993+00
297cc019-ae75-4a60-a5db-24fe02674589	7d21e8cb-88b9-4d9f-98b0-4d9ba7b992d2	c2e70066-5dc2-4e6f-b9dd-54356007fdff	locked	\N	2025-09-04 21:38:45.387993+00
f9e52142-cca8-4eca-9b0e-6c8e35cd1b2c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	5ec3cffb-1479-4256-ae96-923c0e914848	completed	2025-09-05 00:12:41.703+00	2025-09-03 20:30:08.119882+00
baba55e7-602a-45f4-b696-b8d1fa5d827e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	056391cc-932a-479c-b67d-c0013c792b2b	completed	2025-09-08 22:12:05.934+00	2025-09-03 20:30:08.119882+00
b454093b-2ae2-4ce5-8b05-caab67eee8c1	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	59ae035b-4725-45bc-89d9-90acbe8eb691	available	2025-09-23 12:48:39.865+00	2025-09-23 12:48:40.164382+00
338ad63c-6b75-4a0f-a519-f4e3c5678336	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	22dcb6e7-2a81-4033-9bda-b792ec56bf79	available	\N	2025-10-11 15:46:03.588418+00
c224cfe7-db2e-4c6f-9fa5-545aa4db703e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	available	2025-10-10 10:47:27.406+00	2025-10-09 11:59:09.023091+00
97905136-7260-4488-a598-5540c0e64525	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	available	2025-09-22 14:19:28.286+00	2025-09-22 14:19:28.796805+00
4ed47f45-e7ab-41b3-bafc-f22ce8b8c1d3	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	available	2025-10-10 17:20:57.191+00	2025-10-10 17:20:57.906077+00
41b5bdaa-5930-4c0b-a7a8-3499749d81c6	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	available	2025-10-11 15:39:47.709+00	2025-09-03 20:30:08.119882+00
11e911d2-351a-44d0-a25d-3058b13bdd7e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	available	2025-10-11 15:46:23.568+00	2025-10-11 15:44:09.218681+00
\.


--
-- Data for Name: workout_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workout_sessions (id, user_id, quest_id, workout_type, started_at, ended_at, rounds_completed, total_time_seconds, is_completed, created_at) FROM stdin;
e14447ba-9b1d-499c-bc31-ff42b87317e9	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 21:33:34.505274+00	2025-09-08 21:34:37.448+00	2	5	t	2025-09-08 21:33:34.505274+00
ce909c38-b180-49be-a427-c80d8d8609ee	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-15 09:37:15.797334+00	2025-09-15 09:37:30.303+00	2	12	t	2025-09-15 09:37:15.797334+00
dc4320ef-0319-466e-a74b-9a8a14a6bedb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 22:04:37.414016+00	2025-09-08 22:04:48.49+00	3	7	t	2025-09-08 22:04:37.414016+00
ca7cc8d5-cba7-45b9-be07-d4d5cebe8345	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	simple	2025-09-04 00:31:49.638227+00	2025-09-04 00:42:04.274+00	3	12	t	2025-09-04 00:31:49.638227+00
b7564972-27ce-4aed-acbd-480acddc882e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-08 21:37:52.783811+00	2025-09-08 21:38:07.487+00	3	10	t	2025-09-08 21:37:52.783811+00
ae69d513-3038-48e0-89d1-8da7063b1086	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-10 10:45:39.004917+00	2025-09-10 10:45:46.979+00	4	6	t	2025-09-10 10:45:39.004917+00
019031bf-fdc8-4928-adab-b2e87cbaa50f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-08 21:41:00.276801+00	2025-09-08 21:41:11.355+00	2	6	t	2025-09-08 21:41:00.276801+00
0d6bc5a6-a90c-431d-acb1-98011d5b48c0	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-09 10:37:41.847342+00	2025-09-09 10:37:51.703+00	3	6	t	2025-09-09 10:37:41.847342+00
e4b54ca8-c1df-4072-8798-1838e07ff3d1	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	35c3ffdc-3c54-422a-84e1-cd9ab09bbb3a	for_time	2025-09-04 00:42:22.715053+00	2025-09-04 01:48:30.351+00	5	25	t	2025-09-04 00:42:22.715053+00
24574b48-99a5-4783-a2be-c7471a47e308	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-09 10:38:19.360883+00	2025-09-09 10:38:29.86+00	0	7	t	2025-09-09 10:38:19.360883+00
8edca669-e341-4e09-afab-bf78347923fb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-08 21:47:44.063313+00	2025-09-08 21:50:06.357+00	3	6	t	2025-09-08 21:47:44.063313+00
1e2ac4e1-afd5-4716-b17d-d741b47e1640	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 22:07:20.777226+00	2025-09-08 22:08:26.988+00	3	8	t	2025-09-08 22:07:20.777226+00
87cedad7-9c02-462c-920b-b0b0639fe84a	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 21:50:24.902235+00	2025-09-08 21:50:41.926+00	3	9	t	2025-09-08 21:50:24.902235+00
2c73e6f3-fe8a-4130-b9bd-5d7a1447a24a	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	5ec3cffb-1479-4256-ae96-923c0e914848	for_time	2025-09-04 09:57:55.385684+00	2025-09-05 00:12:41.663+00	8	13	t	2025-09-04 09:57:55.385684+00
93bd0de5-16d0-4729-9b62-893a0dedc732	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-15 09:32:12.085565+00	2025-09-15 09:32:21.168+00	3	7	t	2025-09-15 09:32:12.085565+00
c5dc6468-6394-4a68-8fed-2b664c799c4b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 22:09:44.879917+00	2025-09-08 22:10:15.012+00	2	6	t	2025-09-08 22:09:44.879917+00
0924fa20-5828-4ec8-8f18-e80b71bf7f9c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 21:53:00.252039+00	2025-09-08 21:53:13.036+00	3	8	t	2025-09-08 21:53:00.252039+00
2865eabe-0b2b-4ef7-a146-7ea2ae3282f5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-09 10:43:52.044973+00	2025-09-09 10:44:04.115+00	3	9	t	2025-09-09 10:43:52.044973+00
45e521b8-b8c2-438e-ae05-66886f271c5c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	simple	2025-09-04 00:16:54.170445+00	2025-09-08 18:12:55.326+00	0	10	t	2025-09-04 00:16:54.170445+00
dd840004-0b5f-491f-97ad-7c73c42be12b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 21:55:29.789453+00	2025-09-08 21:55:39.934+00	3	6	t	2025-09-08 21:55:29.789453+00
c94df645-399d-4338-991d-62b5e79d308e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 21:27:22.851017+00	2025-09-08 21:27:32.421+00	2	4	t	2025-09-08 21:27:22.851017+00
9394e066-3269-43ec-bd28-16927918cfe3	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 22:11:29.293334+00	2025-09-08 22:11:40.367+00	2	8	t	2025-09-08 22:11:29.293334+00
22b3ebd1-95f5-4164-95f5-85ceb77024bb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 21:28:12.35457+00	2025-09-08 21:28:26.091+00	2	9	t	2025-09-08 21:28:12.35457+00
89892f76-08f1-468a-b2f8-3e137dd09197	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 21:57:50.783009+00	2025-09-08 21:57:58.542+00	2	4	t	2025-09-08 21:57:50.783009+00
5635dc8b-42ff-438c-a4c2-7ac21ead5fce	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 21:31:06.529272+00	2025-09-08 21:31:26.907+00	1	14	t	2025-09-08 21:31:06.529272+00
1710ba48-b027-4a98-a83b-7397ae462205	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-08 21:32:36.748617+00	2025-09-08 21:32:46.246+00	2	4	t	2025-09-08 21:32:36.748617+00
fa124a12-6365-4c50-a5c0-3f7fc57263dd	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-22 14:13:52.844548+00	2025-09-22 14:13:58.23+00	0	2	t	2025-09-22 14:13:52.844548+00
bbdec741-1b00-43ee-93fc-01a50eadbefc	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	056391cc-932a-479c-b67d-c0013c792b2b	tabata	2025-09-05 00:34:35.301833+00	2025-09-08 22:12:05.883+00	4	16	t	2025-09-05 00:34:35.301833+00
6350e598-4b75-46db-8c6f-544d61d59ceb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 21:58:37.406245+00	2025-09-08 21:58:48.121+00	2	7	t	2025-09-08 21:58:37.406245+00
b68230a5-b006-4c79-aa99-00e5d135111e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-09 10:48:25.075345+00	2025-09-09 10:48:39.174+00	3	9	t	2025-09-09 10:48:25.075345+00
59465056-0a0b-49c2-ac1b-e6741a4758c8	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 22:01:57.031126+00	2025-09-08 22:02:12.88+00	2	12	t	2025-09-08 22:01:57.031126+00
73c2b3e3-4988-43ce-ad96-20c5165d7c40	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-10 21:56:19.028965+00	2025-09-10 21:56:37.248+00	2	9	t	2025-09-10 21:56:19.028965+00
4ac0a709-ec18-47ae-a748-bdc7d9f5056e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-09 10:22:03.960646+00	2025-09-09 10:22:21.81+00	3	11	t	2025-09-09 10:22:03.960646+00
9b96a132-f9b9-4a8e-a950-5b1bb5364aa3	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-08 22:02:43.692998+00	2025-09-08 22:02:55.853+00	3	8	t	2025-09-08 22:02:43.692998+00
cd6329f6-b536-45ea-8681-9d3ed8611fcb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-15 09:34:03.989735+00	2025-09-15 09:34:11.767+00	2	6	t	2025-09-15 09:34:03.989735+00
e8731da0-7820-4af1-b0db-441014ff6100	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-09 10:26:14.416164+00	2025-09-09 10:26:22.839+00	3	5	t	2025-09-09 10:26:14.416164+00
05b6784e-6f6e-4a0e-8dfe-55aa57b9d828	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-10 10:37:26.442641+00	2025-09-10 10:37:47.088+00	4	17	t	2025-09-10 10:37:26.442641+00
40b4e2f7-ebf1-4923-b9e9-c8e5838e0165	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	0a59640d-d3ad-4e73-baf6-c9f6757f4937	amrap	2025-09-10 21:53:57.660231+00	2025-09-11 23:13:36.884+00	3	14	t	2025-09-10 21:53:57.660231+00
9c93df71-c27f-438e-821b-e68b3995da36	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-09 10:26:55.315621+00	2025-09-09 10:27:11.423+00	3	12	t	2025-09-09 10:26:55.315621+00
70cdddb9-14fb-4347-89da-1a1668a04898	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	59ae035b-4725-45bc-89d9-90acbe8eb691	simple	2025-10-09 11:51:18.163485+00	\N	0	1	f	2025-10-09 11:51:18.163485+00
9f3326f3-10ab-47e4-a0aa-3afb3645bfe6	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-09-15 20:54:24.24138+00	2025-10-11 15:39:47.657+00	3	19	t	2025-09-15 20:54:24.24138+00
5d1a91af-9f5a-4bfd-9516-bdfbaae40acc	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-15 09:35:10.938511+00	2025-09-15 09:35:18.357+00	2	6	t	2025-09-15 09:35:10.938511+00
38a3df3d-a4eb-44de-ae3d-8ff386f20b78	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-10 10:43:02.493263+00	2025-09-10 10:43:08.698+00	4	4	t	2025-09-10 10:43:02.493263+00
9a5bd99e-a49e-4cc0-a722-f956f850bfa5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-10 21:55:09.513475+00	2025-09-15 09:29:05.79+00	3	10	t	2025-09-10 21:55:09.513475+00
19f665ee-8862-4d9b-9cf3-1bd753b67865	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-15 09:29:53.17398+00	2025-09-15 09:29:58.167+00	2	3	t	2025-09-15 09:29:53.17398+00
915e81e9-8c23-4584-a46e-7ca957254d2f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-22 14:19:17.780767+00	2025-09-22 14:19:28.235+00	2	6	t	2025-09-22 14:19:17.780767+00
10c5c33d-2a91-4ede-9b8d-bb90c30b951d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-22 13:44:06.067049+00	2025-09-22 13:44:15.904+00	2	6	t	2025-09-22 13:44:06.067049+00
747d5be6-925e-431a-acc5-fbd1f0caef6b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-15 09:36:51.247847+00	2025-09-15 09:36:55.665+00	3	2	t	2025-09-15 09:36:51.247847+00
a00bf7c9-708c-47c1-a488-671b887522ef	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-22 14:03:50.640655+00	2025-09-22 14:04:01.846+00	0	7	t	2025-09-22 14:03:50.640655+00
7b36dc6f-8f6f-47d2-85e8-873e84457b8b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-09-22 14:11:16.057868+00	2025-09-22 14:11:21.112+00	0	1	t	2025-09-22 14:11:16.057868+00
3c20be46-593a-4a7a-aa3a-fba3bf998f8f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	simple	2025-10-10 10:19:09.098544+00	2025-10-10 10:19:26.949+00	2	9	t	2025-10-10 10:19:09.098544+00
19064a64-9dad-400b-9b11-95a48d243c71	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	0a59640d-d3ad-4e73-baf6-c9f6757f4937	amrap	2025-09-23 13:03:35.984412+00	2025-09-23 13:03:44.699+00	2	4	t	2025-09-23 13:03:35.984412+00
e2f0f818-addb-4153-b204-1dba86d17d41	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	59ae035b-4725-45bc-89d9-90acbe8eb691	simple	2025-09-23 12:48:30.019124+00	2025-09-23 12:48:39.819+00	2	5	t	2025-09-23 12:48:30.019124+00
ca282e3f-dab5-4ffa-bcab-01154db9af7f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	0a59640d-d3ad-4e73-baf6-c9f6757f4937	amrap	2025-10-09 11:42:59.963964+00	2025-10-09 11:43:17.918+00	2	8	t	2025-10-09 11:42:59.963964+00
af8dc6de-9f04-4b67-be15-c79407412a59	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	simple	2025-10-10 10:47:16.021795+00	2025-10-10 10:47:27.351+00	2	8	t	2025-10-10 10:47:16.021795+00
df11a829-fec9-45bf-9e43-f28d57082f1d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	simple	2025-10-09 11:58:49.042375+00	2025-10-09 11:59:09.908+00	3	15	t	2025-10-09 11:58:49.042375+00
ddd413ad-10c9-437c-b0c9-0354438a8778	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 17:20:47.185298+00	2025-10-10 17:20:57.12+00	0	6	t	2025-10-10 17:20:47.185298+00
00773212-84f9-446a-8e14-e82902067b26	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 17:29:03.982921+00	\N	0	0	f	2025-10-10 17:29:03.982921+00
3c3be575-c4bd-4af4-a142-7b1f2862ece1	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 17:47:49.019223+00	\N	0	0	f	2025-10-10 17:47:49.019223+00
c283435f-8de3-4e95-a0b9-2efea64e08c4	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 17:49:38.954354+00	\N	0	0	f	2025-10-10 17:49:38.954354+00
1826ea4d-dafb-4a56-a25b-3248727d88e4	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 17:51:42.007714+00	\N	0	0	f	2025-10-10 17:51:42.007714+00
53b4eb75-57bf-48e6-aa37-373651e5d05d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 18:23:26.200905+00	\N	0	0	f	2025-10-10 18:23:26.200905+00
978ccffe-14d9-41c7-a97f-750007f32b85	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 18:24:48.697621+00	\N	0	0	f	2025-10-10 18:24:48.697621+00
9a30b13b-571d-45a5-98f8-75fbe786422b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 18:58:40.897168+00	\N	0	0	f	2025-10-10 18:58:40.897168+00
b5d77e18-0a07-43fe-bb48-338bc6829f6e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:11:13.71714+00	\N	0	0	f	2025-10-11 04:11:13.71714+00
3a5d6da8-2c74-4716-98b2-e331dfce2236	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	simple	2025-10-10 23:24:51.970675+00	\N	2	3	f	2025-10-10 23:24:51.970675+00
fadb3415-f092-4d87-b19f-2d6088778d3b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 23:25:10.398028+00	\N	0	0	f	2025-10-10 23:25:10.398028+00
482a523d-5a5b-4b15-b7aa-3647f43fa42c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 23:32:57.014927+00	\N	0	0	f	2025-10-10 23:32:57.014927+00
031e9cb2-9ef4-49e9-aecb-a823cd49a97f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 23:34:00.874854+00	\N	0	0	f	2025-10-10 23:34:00.874854+00
55530f60-c820-4506-b120-39e229a31046	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 23:35:09.530339+00	\N	0	0	f	2025-10-10 23:35:09.530339+00
3f799015-20ea-45d9-954e-d534952bb9de	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 23:39:50.398476+00	\N	0	0	f	2025-10-10 23:39:50.398476+00
6add3bb6-ad97-4704-9f73-3f08b0a48e54	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 23:40:15.11632+00	\N	0	0	f	2025-10-10 23:40:15.11632+00
c228dd62-f14f-44ee-8953-f7483879b675	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 23:41:23.154923+00	\N	0	0	f	2025-10-10 23:41:23.154923+00
c26e391f-0603-485f-8a70-5ea2162847c1	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 23:44:47.040358+00	\N	0	0	f	2025-10-10 23:44:47.040358+00
d644287a-4532-44d8-8d7c-cd392f0d5105	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 23:46:47.392635+00	\N	0	0	f	2025-10-10 23:46:47.392635+00
27ec1928-d2c3-4517-8eff-782738e6fdec	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 23:47:55.477327+00	\N	0	0	f	2025-10-10 23:47:55.477327+00
bedc0bd4-8c99-4067-bfe8-2b3cae0b1e3d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-10 23:55:56.916858+00	\N	0	0	f	2025-10-10 23:55:56.916858+00
e1b6bff1-3c80-439a-821c-56ef924b6670	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 00:00:08.438804+00	\N	0	0	f	2025-10-11 00:00:08.438804+00
5d17e4ac-b67c-4dd6-a5bf-2a7f888c77a2	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 00:16:39.058299+00	\N	0	0	f	2025-10-11 00:16:39.058299+00
c75c6c0d-e2b9-401a-a153-007428819b00	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 02:54:07.869229+00	\N	0	0	f	2025-10-11 02:54:07.869229+00
ba57e7d9-fb68-4742-9caf-b63261d0dccd	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 02:57:31.341192+00	\N	0	73	f	2025-10-11 02:57:31.341192+00
b823d2a4-7eb3-4067-9cf4-cbceed1ea097	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:03:45.093305+00	\N	0	0	f	2025-10-11 03:03:45.093305+00
d8518b64-9b62-41f4-a646-dfdb4d97a114	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:03:48.016729+00	\N	0	3	f	2025-10-11 03:03:48.016729+00
56b740bd-10c1-4200-98e2-911a04026923	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:09:07.535707+00	\N	0	2	f	2025-10-11 03:09:07.535707+00
2ab1e2e7-5677-4a2c-9bc1-bddba2dbf37c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:13:38.065292+00	\N	0	0	f	2025-10-11 03:13:38.065292+00
86dc8ac0-8964-4846-95db-a93b3d764aab	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:16:05.532918+00	\N	0	0	f	2025-10-11 03:16:05.532918+00
3dc6c6ca-f276-414f-b29a-452c7f797913	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:16:37.101551+00	\N	0	0	f	2025-10-11 03:16:37.101551+00
f96cacba-ab04-49c5-a65c-02a8c4c43ac8	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:16:41.032096+00	\N	0	0	f	2025-10-11 03:16:41.032096+00
c1ef3101-a9b5-4072-8ca7-751376a00ab8	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:17:43.144585+00	\N	0	0	f	2025-10-11 03:17:43.144585+00
a92a9cb3-fa65-40fd-a87c-2401aa6a84de	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:17:48.053802+00	\N	0	0	f	2025-10-11 03:17:48.053802+00
d14258f7-b642-4504-a96f-de3636552eb7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:18:13.039918+00	\N	0	0	f	2025-10-11 03:18:13.039918+00
755cd3fb-9853-4065-a481-6dab688b6a23	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:18:39.047063+00	\N	0	0	f	2025-10-11 03:18:39.047063+00
fd940934-10cf-478a-b76b-39889055b7bc	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:18:43.056412+00	\N	0	0	f	2025-10-11 03:18:43.056412+00
53b34c84-0f9a-4f2b-b4a4-632a2b62efc0	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:32:03.147865+00	\N	0	0	f	2025-10-11 03:32:03.147865+00
d4a1871b-f010-4a54-badf-31ff7ede58f7	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:32:06.046755+00	\N	0	0	f	2025-10-11 03:32:06.046755+00
63687ab8-4aba-4944-b947-8e01d14a3bef	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:32:24.051048+00	\N	0	0	f	2025-10-11 03:32:24.051048+00
dd6c2e56-97a5-43f0-911f-80c9fafa5b5b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:36:37.108749+00	\N	0	0	f	2025-10-11 03:36:37.108749+00
9b182ef9-4130-4431-9179-138b426ef94d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:43:50.1459+00	\N	0	0	f	2025-10-11 03:43:50.1459+00
d2368b48-e4ec-4734-8768-84bd8288ad58	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:43:58.102824+00	\N	0	0	f	2025-10-11 03:43:58.102824+00
e9b82758-c079-4218-9b39-f0924c270a58	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 03:45:04.041131+00	\N	0	0	f	2025-10-11 03:45:04.041131+00
4cd9151e-1898-4217-be71-e52557e6a6e2	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:13:50.53188+00	\N	0	0	f	2025-10-11 04:13:50.53188+00
1d16d626-f3bd-4fe2-94b0-5198f73622ef	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:00:14.37491+00	\N	0	0	f	2025-10-11 04:00:14.37491+00
3c6145aa-d0ea-4fde-a5ef-f33498b6d401	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:00:17.083791+00	\N	0	0	f	2025-10-11 04:00:17.083791+00
59b779ee-a4ca-460d-b885-1e3347e75f57	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:07:14.464154+00	\N	0	0	f	2025-10-11 04:07:14.464154+00
c0b84302-4380-4c61-918e-5a2d8f6a1e18	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:07:16.115792+00	\N	0	0	f	2025-10-11 04:07:16.115792+00
b81e9228-4c15-4925-ad19-bef995a5901f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:08:33.143483+00	\N	0	0	f	2025-10-11 04:08:33.143483+00
2c9f3557-13ab-4d05-b9db-57785b02af6c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:08:48.007484+00	\N	0	0	f	2025-10-11 04:08:48.007484+00
52910e9a-59a0-4b2f-ae50-bacac953bdc6	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:08:50.549575+00	\N	0	0	f	2025-10-11 04:08:50.549575+00
d313b95f-4467-4448-9dcc-e4fac78798f6	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:09:00.533616+00	\N	0	0	f	2025-10-11 04:09:00.533616+00
f5430277-f810-47e8-910a-fa2783b258ff	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:09:02.991387+00	\N	0	0	f	2025-10-11 04:09:02.991387+00
a5087389-24b0-46f3-adba-87cb9e62d567	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:09:13.170938+00	\N	0	0	f	2025-10-11 04:09:13.170938+00
197730fa-5a6c-4d87-9f7f-b100b42a7478	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 04:10:10.526362+00	\N	0	0	f	2025-10-11 04:10:10.526362+00
c2c0fba1-a79c-4673-a888-6816899ab740	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 15:36:48.555919+00	\N	0	0	f	2025-10-11 15:36:48.555919+00
a4285009-f9cb-459e-9f76-632a7e9a1ef5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 15:36:50.087972+00	\N	0	0	f	2025-10-11 15:36:50.087972+00
b0652b9f-ff7f-45bc-99ca-0f360e491e0c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 15:36:56.024741+00	\N	0	0	f	2025-10-11 15:36:56.024741+00
54bbfdad-e5de-4119-8846-7d3b5844c895	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 15:37:44.663431+00	\N	0	0	f	2025-10-11 15:37:44.663431+00
1436f8f5-6325-4b71-924d-254ae80fa362	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 15:37:45.847231+00	\N	0	0	f	2025-10-11 15:37:45.847231+00
f8913172-d73d-4bf7-9262-bda908d3e595	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 15:37:46.827405+00	\N	0	0	f	2025-10-11 15:37:46.827405+00
1c27736f-c15a-4563-ab8a-a341b368fddf	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 15:37:54.600115+00	\N	0	0	f	2025-10-11 15:37:54.600115+00
a084372c-925d-4169-a540-c83c918fc4d3	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 15:37:56.063526+00	\N	0	0	f	2025-10-11 15:37:56.063526+00
7dee783e-2c48-41e8-8c67-eacefaa29adf	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 15:37:57.179375+00	\N	0	0	f	2025-10-11 15:37:57.179375+00
56fdea34-6bdd-4a5c-8639-68c7bea9237d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 15:38:02.308036+00	\N	0	0	f	2025-10-11 15:38:02.308036+00
f48220ef-beb4-4979-ab92-21e4eedaae1a	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	0a59640d-d3ad-4e73-baf6-c9f6757f4937	amrap	2025-10-08 07:33:39.873433+00	2025-10-11 15:38:52.218+00	2	18	t	2025-10-08 07:33:39.873433+00
445ab050-73f8-43bc-b7d4-6de75aa68432	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 15:39:10.960847+00	\N	0	0	f	2025-10-11 15:39:10.960847+00
76ed8d73-d363-4642-be1a-fd993fd27ee5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-13 19:50:20.533+00	\N	0	0	f	2025-10-13 19:50:21.075152+00
ef5695a1-2570-4161-8531-3f20872574e0	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 15:44:00.008+00	2025-10-11 15:44:10.926+00	0	8	t	2025-10-11 15:44:00.516152+00
8fffa6e4-8437-40ba-ba3b-50087362625e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-14 12:27:12.76+00	\N	0	0	f	2025-10-14 12:27:13.370205+00
9b5cf0cb-8f29-4ad4-b06c-edf5c2804e9d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 15:44:41.752+00	2025-10-11 15:46:02.827+00	0	15	t	2025-10-11 15:44:42.265329+00
213e0d09-dfa2-403a-9090-9bff5e4279ef	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 15:46:07.914+00	2025-10-11 15:46:23.5+00	0	15	t	2025-10-11 15:46:08.420289+00
65488a20-8185-4f04-84cb-024b4e1f4e23	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 16:02:50.74+00	\N	0	0	f	2025-10-11 16:02:51.294463+00
fb31bc60-dd0d-470c-92e0-d6f782dce1db	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 16:08:23.791+00	\N	0	0	f	2025-10-11 16:08:24.352647+00
8b8f8e8d-105c-4975-a32d-ba3732197bf2	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 16:16:43.029+00	\N	0	0	f	2025-10-11 16:16:43.602919+00
29230412-e805-40e5-96d7-675d070cfe01	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-11 16:16:43.803+00	\N	0	0	f	2025-10-11 16:16:44.37511+00
63169623-6e7b-4ce1-93b3-fee325b4c778	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 16:51:04.037+00	\N	0	0	f	2025-10-11 16:51:04.716463+00
1dd4c438-7466-4500-87f7-884cc49d8bd5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 16:53:54.019+00	\N	0	0	f	2025-10-11 16:53:54.665638+00
b4b01071-f419-45bf-b68e-741394db311f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 16:58:42.141+00	\N	0	0	f	2025-10-11 16:58:42.81208+00
eb81602e-a8ba-46b8-8189-e2e253fbe4fd	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 17:06:43.88+00	\N	0	0	f	2025-10-11 17:06:44.543576+00
da39e19a-48f1-42f6-b3c0-a314676e9338	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-11 17:08:24.93+00	\N	0	0	f	2025-10-11 17:08:25.60684+00
e2442a1c-ecdb-4434-b62b-4d52e2cdbcb2	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-11 17:08:43.859+00	\N	0	0	f	2025-10-11 17:08:44.526885+00
6c2641c2-ea08-4225-9a42-9d7ca2304618	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-11 17:10:54.127+00	\N	0	0	f	2025-10-11 17:10:54.805843+00
2cbe05a2-35ed-479f-84bf-3c0b5836829c	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-11 17:11:09.621+00	\N	0	0	f	2025-10-11 17:11:10.302141+00
30498f19-098c-462d-aa48-fdde0f1b2b7a	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-11 17:11:17.09+00	\N	0	0	f	2025-10-11 17:11:17.776151+00
63bfaf7b-e4bb-4e48-9757-8195dd0d90f1	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-11 17:14:41.358+00	\N	0	0	f	2025-10-11 17:14:42.056129+00
7998154d-04f2-4c9e-98c9-8ee8bcab0546	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	simple	2025-10-11 17:16:42.227+00	\N	0	0	f	2025-10-11 17:16:42.627781+00
16fdf91f-e5f5-4e12-a5b9-819d67ef3b41	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	simple	2025-10-11 17:16:57.139+00	\N	0	0	f	2025-10-11 17:16:57.488232+00
a6f1e5d2-18ce-437c-bc06-72cd4c20dba0	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-11 22:15:55.184+00	\N	0	0	f	2025-10-11 22:15:56.481988+00
aab70681-b0fd-43a7-b6cb-11853b377915	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-11 23:47:44.218+00	\N	0	0	f	2025-10-11 23:47:45.714921+00
2995e131-25ef-432d-84d3-d9671a4eb641	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-11 23:54:16.921+00	\N	0	0	f	2025-10-11 23:54:18.395542+00
16cd9b73-61ea-4923-a55e-19e1614343cc	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-12 00:04:56.759+00	\N	0	0	f	2025-10-12 00:04:58.259553+00
938a5114-e27c-45f1-9162-29b55946a200	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-12 00:05:51.058+00	\N	0	0	f	2025-10-12 00:05:52.553519+00
10f4dbc5-866b-4d95-a0f6-e42c3c93a01f	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-12 00:11:07.212+00	\N	0	0	f	2025-10-12 00:11:08.715506+00
32c0fc3d-55d4-4955-98d7-c0b1eb8f6535	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-12 00:07:57.217+00	\N	0	0	f	2025-10-12 00:07:58.725839+00
be4105ad-81ea-4789-8850-16f18b7e79b5	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-12 00:16:00.421+00	\N	0	0	f	2025-10-12 00:16:01.935585+00
6b81a450-dba6-4fb1-bf4d-65299007b628	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-12 00:20:52.791+00	\N	0	0	f	2025-10-12 00:20:54.312715+00
6eb4e7df-5039-4cbe-be0b-93f46de988dd	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-12 00:22:04.039+00	\N	0	0	f	2025-10-12 00:22:05.565115+00
a14a1ac3-5d82-41c9-9215-5d9102a93583	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-12 00:22:42.625+00	\N	0	0	f	2025-10-12 00:22:44.169503+00
455a1364-90b7-47f8-ae21-2cdb62809ebb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-12 00:25:43.577+00	\N	0	0	f	2025-10-12 00:25:45.105887+00
59a1fb80-67fc-4745-82eb-01373d91854e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cc31a775-a249-4c02-9415-6eba4e4818b6	strength	2025-10-12 13:52:34.904+00	\N	0	0	f	2025-10-12 13:52:35.085285+00
3ddbac9e-e5d4-4573-8ef7-e34c765c06f1	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-12 15:29:26.715+00	\N	0	0	f	2025-10-12 15:29:27.096397+00
f6aa0c99-b4a3-4060-ac38-8c11b6765e96	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	232a6baf-8e71-42e2-bc2b-f4beb1e80b83	simple	2025-10-12 15:33:18.644+00	\N	0	0	f	2025-10-12 15:33:18.994119+00
6719655e-9213-4e20-8be8-6e71251c0a5e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-10-14 12:28:11.667+00	\N	0	0	f	2025-10-14 12:28:12.151519+00
ec567f65-fb32-4ec4-80ef-a6aeb8c8f41b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-10-12 15:33:56.625+00	\N	0	0	f	2025-10-12 15:33:56.975525+00
6310e959-2f92-4da4-88bf-e05d0b3a69ed	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	981969b7-6d3c-45ed-b4e4-473367df335e	amrap	2025-10-12 16:06:21.366+00	\N	0	0	f	2025-10-12 16:06:21.783104+00
2590d6df-a97a-4089-aad0-ff10d71f461a	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-12 19:21:34.242+00	\N	0	0	f	2025-10-12 19:21:34.920918+00
68a7c504-9d0c-4d8f-960e-4ae02421afdd	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-12 19:22:18.08+00	\N	0	0	f	2025-10-12 19:22:18.615093+00
c9c27f41-6a40-4bc3-a316-15363a4db368	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-13 12:21:44.907+00	\N	0	0	f	2025-10-13 12:21:47.76+00
84160a80-fe22-4cc4-b138-0052249da2bb	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-13 14:53:58.751+00	\N	0	0	f	2025-10-13 14:53:59.07107+00
ba1babea-8f96-47e7-be9c-7c7ed7db7ab0	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-10-14 12:28:17.231+00	\N	0	0	f	2025-10-14 12:28:17.703572+00
631bc56c-f3e3-4ec0-9c0b-41d56bacbc2b	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-14 12:28:33.384+00	\N	0	0	f	2025-10-14 12:28:33.878022+00
0c5d8592-8c42-4cbc-9c45-8a58bf87a54d	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-15 11:09:59.436+00	\N	0	0	f	2025-10-15 11:10:00.030231+00
7e65acc8-25d4-4a63-a2e3-7a104aea2b56	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-15 11:16:17.273+00	\N	0	0	f	2025-10-15 11:16:17.819514+00
7f83a254-77e0-458d-81c0-28bc1f660e5e	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1fc7be30-7281-45f8-92ef-317256d025c9	tabata	2025-10-15 15:52:16.066+00	\N	0	0	f	2025-10-15 15:52:16.149319+00
1a79af7c-e6b2-4663-bddc-7dc11be72cc3	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-15 15:52:35.026+00	\N	0	0	f	2025-10-15 15:52:35.068624+00
cec56e0e-f56c-4315-8c49-b287cab2f056	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	cd505854-0676-4947-8d96-0dbe3b21da3b	amrap	2025-10-17 10:43:56.433+00	\N	0	0	f	2025-10-17 10:43:56.675363+00
d661538f-c88f-4eed-8e9f-e16d45bcc384	03543d2b-3d0d-4e5b-adf6-7ce1c3d3570b	1f2bc5ae-0ea6-4ecb-97cc-f5a566320d41	strength	2025-10-17 10:44:33.575+00	\N	0	0	f	2025-10-17 10:44:33.76473+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-09-02 23:27:56
20211116045059	2025-09-02 23:27:58
20211116050929	2025-09-02 23:28:00
20211116051442	2025-09-02 23:28:02
20211116212300	2025-09-02 23:28:04
20211116213355	2025-09-02 23:28:06
20211116213934	2025-09-02 23:28:07
20211116214523	2025-09-02 23:28:09
20211122062447	2025-09-02 23:28:11
20211124070109	2025-09-02 23:28:13
20211202204204	2025-09-02 23:28:14
20211202204605	2025-09-02 23:28:16
20211210212804	2025-09-02 23:28:21
20211228014915	2025-09-02 23:28:23
20220107221237	2025-09-02 23:28:24
20220228202821	2025-09-02 23:28:26
20220312004840	2025-09-02 23:28:28
20220603231003	2025-09-02 23:28:30
20220603232444	2025-09-02 23:28:32
20220615214548	2025-09-02 23:28:34
20220712093339	2025-09-02 23:28:36
20220908172859	2025-09-02 23:28:37
20220916233421	2025-09-02 23:28:39
20230119133233	2025-09-02 23:28:40
20230128025114	2025-09-02 23:28:43
20230128025212	2025-09-02 23:28:44
20230227211149	2025-09-02 23:28:46
20230228184745	2025-09-02 23:28:48
20230308225145	2025-09-02 23:28:49
20230328144023	2025-09-02 23:28:51
20231018144023	2025-09-02 23:28:53
20231204144023	2025-09-02 23:28:55
20231204144024	2025-09-02 23:28:57
20231204144025	2025-09-02 23:28:59
20240108234812	2025-09-02 23:29:00
20240109165339	2025-09-02 23:29:02
20240227174441	2025-09-02 23:29:05
20240311171622	2025-09-02 23:29:07
20240321100241	2025-09-02 23:29:11
20240401105812	2025-09-02 23:29:15
20240418121054	2025-09-02 23:29:17
20240523004032	2025-09-02 23:29:23
20240618124746	2025-09-02 23:29:25
20240801235015	2025-09-02 23:29:27
20240805133720	2025-09-02 23:29:28
20240827160934	2025-09-02 23:29:30
20240919163303	2025-09-02 23:29:32
20240919163305	2025-09-02 23:29:34
20241019105805	2025-09-02 23:29:35
20241030150047	2025-09-02 23:29:42
20241108114728	2025-09-02 23:29:44
20241121104152	2025-09-02 23:29:46
20241130184212	2025-09-02 23:29:48
20241220035512	2025-09-02 23:29:49
20241220123912	2025-09-02 23:29:51
20241224161212	2025-09-02 23:29:52
20250107150512	2025-09-02 23:29:54
20250110162412	2025-09-02 23:29:56
20250123174212	2025-09-02 23:29:57
20250128220012	2025-09-02 23:29:59
20250506224012	2025-09-02 23:30:00
20250523164012	2025-09-02 23:30:02
20250714121412	2025-09-02 23:30:03
20250905041441	2025-10-10 16:17:15
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-09-02 23:27:54.230426
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-09-02 23:27:54.234516
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-09-02 23:27:54.236621
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-09-02 23:27:54.284139
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-09-02 23:27:54.389864
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-09-02 23:27:54.392367
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-09-02 23:27:54.395375
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-09-02 23:27:54.398965
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-09-02 23:27:54.401612
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-09-02 23:27:54.404059
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-09-02 23:27:54.406914
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-09-02 23:27:54.410017
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-09-02 23:27:54.417
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-09-02 23:27:54.421026
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-09-02 23:27:54.424001
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-09-02 23:27:54.445164
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-09-02 23:27:54.448687
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-09-02 23:27:54.451244
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-09-02 23:27:54.454607
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-09-02 23:27:54.459347
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-09-02 23:27:54.461999
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-09-02 23:27:54.466773
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-09-02 23:27:54.478423
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-09-02 23:27:54.489696
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-09-02 23:27:54.492622
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-09-02 23:27:54.495926
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-10-10 16:17:18.029339
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-10-10 16:17:18.105505
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-10-10 16:17:18.113918
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-10-10 16:17:18.12144
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-10-10 16:17:18.126627
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-10-10 16:17:18.13296
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-10-10 16:17:18.140108
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-10-10 16:17:18.146459
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-10-10 16:17:18.148013
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-10-10 16:17:18.151854
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-10-10 16:17:18.154172
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-10-10 16:17:18.167916
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-10-10 16:17:18.172143
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-10-10 16:17:18.202238
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-10-10 16:17:18.205529
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-10-10 16:17:18.215573
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-10-10 16:17:18.220058
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-10-10 16:17:18.226337
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name, created_by, idempotency_key) FROM stdin;
20250903122334	{"-- Create profiles table\nCREATE TABLE public.profiles (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,\n  display_name TEXT DEFAULT 'Nouvel Athlète',\n  avatar_emoji TEXT DEFAULT '🧑‍💻',\n  level INTEGER DEFAULT 0,\n  xp_total INTEGER DEFAULT 0,\n  stat_force INTEGER DEFAULT 0,\n  stat_endurance INTEGER DEFAULT 0,\n  stat_agilite INTEGER DEFAULT 0,\n  stat_mental INTEGER DEFAULT 0,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Create campaigns table\nCREATE TABLE public.campaigns (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  slug TEXT NOT NULL UNIQUE,\n  title TEXT NOT NULL,\n  description TEXT,\n  is_active BOOLEAN DEFAULT true,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Create quests table\nCREATE TABLE public.quests (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,\n  order_index INTEGER NOT NULL,\n  title TEXT NOT NULL,\n  description TEXT,\n  type TEXT NOT NULL CHECK (type IN ('quete', 'boss')),\n  xp_force INTEGER DEFAULT 0,\n  xp_endurance INTEGER DEFAULT 0,\n  xp_agilite INTEGER DEFAULT 0,\n  xp_mental INTEGER DEFAULT 0,\n  xp_total INTEGER DEFAULT 0,\n  workout_type TEXT NOT NULL CHECK (workout_type IN ('emom', 'tabata', 'amrap', 'for_time', 'simple')),\n  work_seconds INTEGER DEFAULT 0,\n  rest_seconds INTEGER DEFAULT 0,\n  rounds_target INTEGER DEFAULT 0,\n  total_minutes INTEGER DEFAULT 0,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Create quest_exercises table\nCREATE TABLE public.quest_exercises (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,\n  order_index INTEGER NOT NULL,\n  name TEXT NOT NULL,\n  target_reps INTEGER DEFAULT 0,\n  notes TEXT,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Create user_quests table\nCREATE TABLE public.user_quests (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,\n  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,\n  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'completed')),\n  completed_at TIMESTAMP WITH TIME ZONE,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n  UNIQUE(user_id, quest_id)\n);\n\n-- Create badges table\nCREATE TABLE public.badges (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  slug TEXT NOT NULL UNIQUE,\n  name TEXT NOT NULL,\n  emoji TEXT NOT NULL,\n  condition_type TEXT NOT NULL CHECK (condition_type IN ('min_sessions', 'first_superset', 'beat_final_boss')),\n  condition_value INTEGER NOT NULL,\n  description TEXT,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Create user_badges table\nCREATE TABLE public.user_badges (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,\n  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,\n  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n  UNIQUE(user_id, badge_id)\n);\n\n-- Create workout_sessions table\nCREATE TABLE public.workout_sessions (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,\n  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,\n  workout_type TEXT NOT NULL,\n  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n  ended_at TIMESTAMP WITH TIME ZONE,\n  rounds_completed INTEGER DEFAULT 0,\n  total_time_seconds INTEGER DEFAULT 0,\n  is_completed BOOLEAN DEFAULT false,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Create session_rounds table\nCREATE TABLE public.session_rounds (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,\n  round_no INTEGER NOT NULL,\n  duration_seconds INTEGER DEFAULT 0,\n  reps_total INTEGER DEFAULT 0,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Create audit_xp table\nCREATE TABLE public.audit_xp (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,\n  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,\n  delta_force INTEGER DEFAULT 0,\n  delta_endurance INTEGER DEFAULT 0,\n  delta_agilite INTEGER DEFAULT 0,\n  delta_mental INTEGER DEFAULT 0,\n  delta_total INTEGER DEFAULT 0,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Enable Row Level Security\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.quest_exercises ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.session_rounds ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.audit_xp ENABLE ROW LEVEL SECURITY;\n\n-- Create RLS Policies\n-- Profiles policies\nCREATE POLICY \\"Users can view their own profile\\" ON public.profiles FOR SELECT USING (auth.uid() = user_id);\nCREATE POLICY \\"Users can update their own profile\\" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);\nCREATE POLICY \\"Users can insert their own profile\\" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);\n\n-- Campaigns policies (public read)\nCREATE POLICY \\"Anyone can view campaigns\\" ON public.campaigns FOR SELECT USING (true);\n\n-- Quests policies (public read)\nCREATE POLICY \\"Anyone can view quests\\" ON public.quests FOR SELECT USING (true);\n\n-- Quest exercises policies (public read)\nCREATE POLICY \\"Anyone can view quest exercises\\" ON public.quest_exercises FOR SELECT USING (true);\n\n-- User quests policies\nCREATE POLICY \\"Users can view their own quest progress\\" ON public.user_quests FOR SELECT USING (auth.uid() = user_id);\nCREATE POLICY \\"Users can update their own quest progress\\" ON public.user_quests FOR UPDATE USING (auth.uid() = user_id);\nCREATE POLICY \\"Users can insert their own quest progress\\" ON public.user_quests FOR INSERT WITH CHECK (auth.uid() = user_id);\n\n-- Badges policies (public read)\nCREATE POLICY \\"Anyone can view badges\\" ON public.badges FOR SELECT USING (true);\n\n-- User badges policies\nCREATE POLICY \\"Users can view their own badges\\" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);\nCREATE POLICY \\"Users can insert their own badges\\" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);\n\n-- Workout sessions policies\nCREATE POLICY \\"Users can view their own sessions\\" ON public.workout_sessions FOR SELECT USING (auth.uid() = user_id);\nCREATE POLICY \\"Users can insert their own sessions\\" ON public.workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);\nCREATE POLICY \\"Users can update their own sessions\\" ON public.workout_sessions FOR UPDATE USING (auth.uid() = user_id);\n\n-- Session rounds policies\nCREATE POLICY \\"Users can view their own session rounds\\" ON public.session_rounds \nFOR SELECT USING (auth.uid() = (SELECT user_id FROM public.workout_sessions WHERE id = session_id));\nCREATE POLICY \\"Users can insert their own session rounds\\" ON public.session_rounds \nFOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.workout_sessions WHERE id = session_id));\n\n-- Audit XP policies\nCREATE POLICY \\"Users can view their own XP audit\\" ON public.audit_xp FOR SELECT USING (auth.uid() = user_id);\nCREATE POLICY \\"Users can insert their own XP audit\\" ON public.audit_xp FOR INSERT WITH CHECK (auth.uid() = user_id);\n\n-- Create function to automatically create profile on signup\nCREATE OR REPLACE FUNCTION public.handle_new_user()\nRETURNS TRIGGER AS $$\nBEGIN\n  INSERT INTO public.profiles (user_id, display_name, avatar_emoji)\n  VALUES (NEW.id, 'Nouvel Athlète', '🧑‍💻');\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER;\n\n-- Create trigger for new user signup\nCREATE TRIGGER on_auth_user_created\n  AFTER INSERT ON auth.users\n  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();\n\n-- Create function to initialize user quests for new users\nCREATE OR REPLACE FUNCTION public.initialize_user_quests(p_user_id UUID, p_campaign_id UUID)\nRETURNS VOID AS $$\nDECLARE\n  quest_record RECORD;\n  first_quest BOOLEAN := true;\nBEGIN\n  FOR quest_record IN \n    SELECT id FROM public.quests \n    WHERE campaign_id = p_campaign_id \n    ORDER BY order_index\n  LOOP\n    INSERT INTO public.user_quests (user_id, quest_id, status)\n    VALUES (\n      p_user_id, \n      quest_record.id, \n      CASE WHEN first_quest THEN 'available' ELSE 'locked' END\n    );\n    first_quest := false;\n  END LOOP;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER;\n\n-- Insert seed data\n-- Campaign\nINSERT INTO public.campaigns (slug, title, description, is_active) VALUES\n('jaime-pas-le-cardio', 'J''aime pas le cardio', 'Parcours débutant pour progresser sans ''cardio'' classique, via musculation légère, supersets et mini-HIIT.', true);\n\n-- Get campaign ID for quests\nDO $$\nDECLARE\n  campaign_uuid UUID;\nBEGIN\n  SELECT id INTO campaign_uuid FROM public.campaigns WHERE slug = 'jaime-pas-le-cardio';\n  \n  -- Insert quests\n  INSERT INTO public.quests (campaign_id, order_index, title, description, type, xp_force, xp_endurance, xp_agilite, xp_mental, xp_total, workout_type, work_seconds, rest_seconds, rounds_target, total_minutes) VALUES\n  (campaign_uuid, 1, 'Première séance full-body haltères', 'Séance simple : squats haltères, pompes, sit-ups.', 'quete', 20, 5, 0, 5, 30, 'simple', 0, 0, 0, 0),\n  (campaign_uuid, 2, 'Découverte des supersets', 'Ton premier superset : squats + pompes enchaînés.', 'quete', 30, 10, 5, 5, 50, 'for_time', 0, 0, 3, 0),\n  (campaign_uuid, 3, 'Mini Boss – 3 rounds squats & pompes', '3 rounds de 10 squats + 10 pompes (chronométré).', 'boss', 20, 15, 5, 10, 50, 'for_time', 0, 0, 3, 0),\n  (campaign_uuid, 4, 'HIIT débutant 4×20sec', 'Jumping jacks, air squats, push-up, sit-ups (4×20s / 10s repos).', 'quete', 10, 30, 10, 10, 60, 'tabata', 20, 10, 4, 0),\n  (campaign_uuid, 5, 'Superset haut/bas', 'Développé haltères + fentes en superset.', 'quete', 30, 15, 10, 10, 65, 'for_time', 0, 0, 4, 0),\n  (campaign_uuid, 6, 'Boss Final – Dungeon Challenge (15 min for time)', 'Pendant 15 min : 10 squats haltères, 10 pompes, 10 sit-ups (max tours).', 'boss', 40, 40, 20, 20, 120, 'amrap', 0, 0, 0, 15);\nEND $$;\n\n-- Insert quest exercises\nDO $$\nDECLARE\n  quest_uuid UUID;\nBEGIN\n  -- Q1 exercises\n  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'Première séance full-body haltères';\n  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES\n  (quest_uuid, 1, 'Squats haltères', 12),\n  (quest_uuid, 2, 'Pompes', 10),\n  (quest_uuid, 3, 'Sit-ups', 15);\n  \n  -- Q2 exercises\n  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'Découverte des supersets';\n  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES\n  (quest_uuid, 1, 'Squats', 12),\n  (quest_uuid, 2, 'Pompes', 10);\n  \n  -- Q3 exercises\n  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'Mini Boss – 3 rounds squats & pompes';\n  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES\n  (quest_uuid, 1, 'Squats', 10),\n  (quest_uuid, 2, 'Pompes', 10);\n  \n  -- Q4 exercises\n  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'HIIT débutant 4×20sec';\n  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES\n  (quest_uuid, 1, 'Jumping jacks', 0),\n  (quest_uuid, 2, 'Air squats', 0),\n  (quest_uuid, 3, 'Push-ups', 0),\n  (quest_uuid, 4, 'Sit-ups', 0);\n  \n  -- Q5 exercises\n  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'Superset haut/bas';\n  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES\n  (quest_uuid, 1, 'Développé haltères', 10),\n  (quest_uuid, 2, 'Fentes', 10);\n  \n  -- Q6 exercises\n  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'Boss Final – Dungeon Challenge (15 min for time)';\n  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES\n  (quest_uuid, 1, 'Squats haltères', 10),\n  (quest_uuid, 2, 'Pompes', 10),\n  (quest_uuid, 3, 'Sit-ups', 10);\nEND $$;\n\n-- Insert badges\nINSERT INTO public.badges (slug, name, emoji, condition_type, condition_value, description) VALUES\n('novice-sans-cardio', 'Novice sans cardio', '🥉', 'min_sessions', 3, '3 séances complétées dans la campagne.'),\n('superset-slayer', 'Superset Slayer', '⚡', 'first_superset', 1, 'Tu as réussi ta première séance en superset.'),\n('boss-final-vaincu', 'Boss Final Vaincu', '🏆', 'beat_final_boss', 1, 'Tu as vaincu le Dungeon Challenge.');\n\n-- Create function to handle quest completion\nCREATE OR REPLACE FUNCTION public.complete_quest(p_user_id UUID, p_quest_id UUID)\nRETURNS JSONB AS $$\nDECLARE\n  quest_record RECORD;\n  profile_record RECORD;\n  next_quest_id UUID;\n  result JSONB;\nBEGIN\n  -- Get quest details\n  SELECT * INTO quest_record FROM public.quests WHERE id = p_quest_id;\n  \n  -- Get current profile\n  SELECT * INTO profile_record FROM public.profiles WHERE user_id = p_user_id;\n  \n  -- Update quest status\n  UPDATE public.user_quests \n  SET status = 'completed', completed_at = now()\n  WHERE user_id = p_user_id AND quest_id = p_quest_id AND status = 'available';\n  \n  -- Update profile stats\n  UPDATE public.profiles SET\n    xp_total = xp_total + quest_record.xp_total,\n    stat_force = stat_force + quest_record.xp_force,\n    stat_endurance = stat_endurance + quest_record.xp_endurance,\n    stat_agilite = stat_agilite + quest_record.xp_agilite,\n    stat_mental = stat_mental + quest_record.xp_mental,\n    level = GREATEST(0, FLOOR((xp_total + quest_record.xp_total) / 200)),\n    updated_at = now()\n  WHERE user_id = p_user_id;\n  \n  -- Log XP audit\n  INSERT INTO public.audit_xp (user_id, quest_id, delta_force, delta_endurance, delta_agilite, delta_mental, delta_total)\n  VALUES (p_user_id, p_quest_id, quest_record.xp_force, quest_record.xp_endurance, quest_record.xp_agilite, quest_record.xp_mental, quest_record.xp_total);\n  \n  -- Unlock next quest\n  SELECT q.id INTO next_quest_id\n  FROM public.quests q\n  WHERE q.campaign_id = quest_record.campaign_id \n    AND q.order_index = quest_record.order_index + 1;\n  \n  IF next_quest_id IS NOT NULL THEN\n    UPDATE public.user_quests \n    SET status = 'available'\n    WHERE user_id = p_user_id AND quest_id = next_quest_id AND status = 'locked';\n  END IF;\n  \n  result := jsonb_build_object(\n    'success', true,\n    'xp_gained', quest_record.xp_total,\n    'next_quest_unlocked', next_quest_id IS NOT NULL\n  );\n  \n  RETURN result;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER;"}		yelox.pro@gmail.com	\N
20250907104755	{"-- Ajout des champs niveau et environnement pour les campagnes et quêtes\n-- Campagnes: niveau, environnement, durée estimée, statut publié\nALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS level_required TEXT CHECK (level_required IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'));\nALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS equipment_tags TEXT[];\nALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS estimated_duration_weeks INTEGER DEFAULT 4;\nALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;\n\n-- Quêtes: niveau, environnement, durée par entraînement, type one-shot\nALTER TABLE public.quests ADD COLUMN IF NOT EXISTS level_required TEXT CHECK (level_required IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'));\nALTER TABLE public.quests ADD COLUMN IF NOT EXISTS equipment_tags TEXT[];\nALTER TABLE public.quests ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER DEFAULT 30;\nALTER TABLE public.quests ADD COLUMN IF NOT EXISTS is_one_shot BOOLEAN DEFAULT false;\nALTER TABLE public.quests ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;\n\n-- Index pour améliorer les performances des filtres\nCREATE INDEX IF NOT EXISTS idx_campaigns_level ON public.campaigns(level_required);\nCREATE INDEX IF NOT EXISTS idx_campaigns_published ON public.campaigns(is_published);\nCREATE INDEX IF NOT EXISTS idx_quests_level ON public.quests(level_required);\nCREATE INDEX IF NOT EXISTS idx_quests_one_shot ON public.quests(is_one_shot);\nCREATE INDEX IF NOT EXISTS idx_quests_published ON public.quests(is_published);"}		yelox.pro@gmail.com	\N
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 186, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: audit_xp audit_xp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_xp
    ADD CONSTRAINT audit_xp_pkey PRIMARY KEY (id);


--
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- Name: badges badges_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_slug_key UNIQUE (slug);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_slug_key UNIQUE (slug);


--
-- Name: exercise_logs exercise_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_logs
    ADD CONSTRAINT exercise_logs_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: quest_exercises quest_exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quest_exercises
    ADD CONSTRAINT quest_exercises_pkey PRIMARY KEY (id);


--
-- Name: quests quests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quests
    ADD CONSTRAINT quests_pkey PRIMARY KEY (id);


--
-- Name: session_rounds session_rounds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_rounds
    ADD CONSTRAINT session_rounds_pkey PRIMARY KEY (id);


--
-- Name: user_quests uq_user_quests_user_quest_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_quests
    ADD CONSTRAINT uq_user_quests_user_quest_unique UNIQUE (user_id, quest_id);


--
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (id);


--
-- Name: user_badges user_badges_user_id_badge_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_badge_id_key UNIQUE (user_id, badge_id);


--
-- Name: user_quests user_quests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_quests
    ADD CONSTRAINT user_quests_pkey PRIMARY KEY (id);


--
-- Name: user_quests user_quests_user_id_quest_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_quests
    ADD CONSTRAINT user_quests_user_id_quest_id_key UNIQUE (user_id, quest_id);


--
-- Name: workout_sessions workout_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workout_sessions
    ADD CONSTRAINT workout_sessions_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_idempotency_key_key; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_idempotency_key_key UNIQUE (idempotency_key);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_campaigns_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_campaigns_level ON public.campaigns USING btree (level_required);


--
-- Name: idx_campaigns_published; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_campaigns_published ON public.campaigns USING btree (is_published);


--
-- Name: idx_exercise_logs_exercise; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exercise_logs_exercise ON public.exercise_logs USING btree (exercise_id);


--
-- Name: idx_exercise_logs_session; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exercise_logs_session ON public.exercise_logs USING btree (session_id);


--
-- Name: idx_quests_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quests_level ON public.quests USING btree (level_required);


--
-- Name: idx_quests_one_shot; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quests_one_shot ON public.quests USING btree (is_one_shot);


--
-- Name: idx_quests_published; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quests_published ON public.quests USING btree (is_published);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: audit_xp audit_xp_quest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_xp
    ADD CONSTRAINT audit_xp_quest_id_fkey FOREIGN KEY (quest_id) REFERENCES public.quests(id) ON DELETE CASCADE;


--
-- Name: audit_xp audit_xp_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_xp
    ADD CONSTRAINT audit_xp_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercise_logs exercise_logs_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_logs
    ADD CONSTRAINT exercise_logs_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.quest_exercises(id);


--
-- Name: exercise_logs exercise_logs_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_logs
    ADD CONSTRAINT exercise_logs_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.workout_sessions(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quest_exercises quest_exercises_quest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quest_exercises
    ADD CONSTRAINT quest_exercises_quest_id_fkey FOREIGN KEY (quest_id) REFERENCES public.quests(id) ON DELETE CASCADE;


--
-- Name: quests quests_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quests
    ADD CONSTRAINT quests_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: session_rounds session_rounds_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_rounds
    ADD CONSTRAINT session_rounds_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.workout_sessions(id) ON DELETE CASCADE;


--
-- Name: user_badges user_badges_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE;


--
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_quests user_quests_quest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_quests
    ADD CONSTRAINT user_quests_quest_id_fkey FOREIGN KEY (quest_id) REFERENCES public.quests(id) ON DELETE CASCADE;


--
-- Name: user_quests user_quests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_quests
    ADD CONSTRAINT user_quests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: workout_sessions workout_sessions_quest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workout_sessions
    ADD CONSTRAINT workout_sessions_quest_id_fkey FOREIGN KEY (quest_id) REFERENCES public.quests(id) ON DELETE CASCADE;


--
-- Name: workout_sessions workout_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workout_sessions
    ADD CONSTRAINT workout_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: badges Anyone can view badges; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);


--
-- Name: campaigns Anyone can view campaigns; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view campaigns" ON public.campaigns FOR SELECT USING (true);


--
-- Name: quest_exercises Anyone can view quest exercises; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view quest exercises" ON public.quest_exercises FOR SELECT USING (true);


--
-- Name: quests Anyone can view quests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view quests" ON public.quests FOR SELECT USING (true);


--
-- Name: campaigns Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.campaigns USING (true);


--
-- Name: quest_exercises Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.quest_exercises USING (true);


--
-- Name: quests Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.quests USING (true);


--
-- Name: audit_xp Users can insert their own XP audit; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own XP audit" ON public.audit_xp FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_badges Users can insert their own badges; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_quests Users can insert their own quest progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own quest progress" ON public.user_quests FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_quests Users can insert their own quests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own quests" ON public.user_quests FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: session_rounds Users can insert their own session rounds; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own session rounds" ON public.session_rounds FOR INSERT WITH CHECK ((auth.uid() = ( SELECT workout_sessions.user_id
   FROM public.workout_sessions
  WHERE (workout_sessions.id = session_rounds.session_id))));


--
-- Name: workout_sessions Users can insert their own sessions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own sessions" ON public.workout_sessions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: exercise_logs Users can manage their exercise logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage their exercise logs" ON public.exercise_logs USING ((session_id IN ( SELECT workout_sessions.id
   FROM public.workout_sessions
  WHERE (workout_sessions.user_id = auth.uid()))));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_quests Users can update their own quest progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own quest progress" ON public.user_quests FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: workout_sessions Users can update their own sessions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own sessions" ON public.workout_sessions FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: audit_xp Users can view their own XP audit; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own XP audit" ON public.audit_xp FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_badges Users can view their own badges; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_quests Users can view their own quest progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own quest progress" ON public.user_quests FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: session_rounds Users can view their own session rounds; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own session rounds" ON public.session_rounds FOR SELECT USING ((auth.uid() = ( SELECT workout_sessions.user_id
   FROM public.workout_sessions
  WHERE (workout_sessions.id = session_rounds.session_id))));


--
-- Name: workout_sessions Users can view their own sessions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own sessions" ON public.workout_sessions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: audit_xp; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.audit_xp ENABLE ROW LEVEL SECURITY;

--
-- Name: badges; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

--
-- Name: campaigns; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: exercise_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: quest_exercises; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.quest_exercises ENABLE ROW LEVEL SECURITY;

--
-- Name: quests; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

--
-- Name: session_rounds; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.session_rounds ENABLE ROW LEVEL SECURITY;

--
-- Name: user_badges; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

--
-- Name: user_quests; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;

--
-- Name: workout_sessions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION complete_quest(p_user_id uuid, p_quest_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.complete_quest(p_user_id uuid, p_quest_id uuid) TO anon;
GRANT ALL ON FUNCTION public.complete_quest(p_user_id uuid, p_quest_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.complete_quest(p_user_id uuid, p_quest_id uuid) TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION initialize_user_quests(p_user_id uuid, p_campaign_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.initialize_user_quests(p_user_id uuid, p_campaign_id uuid) TO anon;
GRANT ALL ON FUNCTION public.initialize_user_quests(p_user_id uuid, p_campaign_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.initialize_user_quests(p_user_id uuid, p_campaign_id uuid) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE audit_xp; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_xp TO anon;
GRANT ALL ON TABLE public.audit_xp TO authenticated;
GRANT ALL ON TABLE public.audit_xp TO service_role;


--
-- Name: TABLE badges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.badges TO anon;
GRANT ALL ON TABLE public.badges TO authenticated;
GRANT ALL ON TABLE public.badges TO service_role;


--
-- Name: TABLE campaigns; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.campaigns TO anon;
GRANT ALL ON TABLE public.campaigns TO authenticated;
GRANT ALL ON TABLE public.campaigns TO service_role;


--
-- Name: TABLE exercise_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exercise_logs TO anon;
GRANT ALL ON TABLE public.exercise_logs TO authenticated;
GRANT ALL ON TABLE public.exercise_logs TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE quest_exercises; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.quest_exercises TO anon;
GRANT ALL ON TABLE public.quest_exercises TO authenticated;
GRANT ALL ON TABLE public.quest_exercises TO service_role;


--
-- Name: TABLE quests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.quests TO anon;
GRANT ALL ON TABLE public.quests TO authenticated;
GRANT ALL ON TABLE public.quests TO service_role;


--
-- Name: TABLE session_rounds; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.session_rounds TO anon;
GRANT ALL ON TABLE public.session_rounds TO authenticated;
GRANT ALL ON TABLE public.session_rounds TO service_role;


--
-- Name: TABLE user_badges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_badges TO anon;
GRANT ALL ON TABLE public.user_badges TO authenticated;
GRANT ALL ON TABLE public.user_badges TO service_role;


--
-- Name: TABLE user_quests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_quests TO anon;
GRANT ALL ON TABLE public.user_quests TO authenticated;
GRANT ALL ON TABLE public.user_quests TO service_role;


--
-- Name: TABLE workout_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.workout_sessions TO anon;
GRANT ALL ON TABLE public.workout_sessions TO authenticated;
GRANT ALL ON TABLE public.workout_sessions TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict g81fpiYnaggWJBmodMZ6JfaY0AjWVFX1kWWTi8uCJOgA2mDVpK2jrDThcuSjHZ8

--
-- PostgreSQL database cluster dump complete
--

