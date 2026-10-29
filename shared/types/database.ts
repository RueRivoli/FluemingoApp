export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      api_usage: {
        Row: {
          function_name: string
          id: number
          request_count: number
          usage_date: string
          user_id: string
        }
        Insert: {
          function_name: string
          id?: never
          request_count?: number
          usage_date?: string
          user_id: string
        }
        Update: {
          function_name?: string
          id?: never
          request_count?: number
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      en_chapters: {
        Row: {
          audio_url: string | null
          content: string | null
          content_multi: Json | null
          created_at: string
          description: string | null
          duration: number | null
          id: number
          image_url: string | null
          is_corrected: boolean | null
          long_format_id: number | null
          order_id: number | null
          title: string | null
          title_de: string | null
          title_es: string | null
          title_fr: string | null
          title_it: string | null
          title_ja: string | null
          title_nl: string | null
          title_pt: string | null
        }
        Insert: {
          audio_url?: string | null
          content?: string | null
          content_multi?: Json | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: number
          image_url?: string | null
          is_corrected?: boolean | null
          long_format_id?: number | null
          order_id?: number | null
          title?: string | null
          title_de?: string | null
          title_es?: string | null
          title_fr?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Update: {
          audio_url?: string | null
          content?: string | null
          content_multi?: Json | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: number
          image_url?: string | null
          is_corrected?: boolean | null
          long_format_id?: number | null
          order_id?: number | null
          title?: string | null
          title_de?: string | null
          title_es?: string | null
          title_fr?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_fr_long_format_id_fkey"
            columns: ["long_format_id"]
            isOneToOne: false
            referencedRelation: "en_content"
            referencedColumns: ["id"]
          },
        ]
      }
      en_content: {
        Row: {
          accent: string | null
          audio_url: string | null
          author: string | null
          category_1: string | null
          category_2: string | null
          category_3: string | null
          content: string | null
          content_multi: Json | null
          content_type: number
          created_at: string
          date_creation: string | null
          description: string | null
          description_de: string | null
          description_es: string | null
          description_fr: string | null
          description_it: string | null
          description_ja: string | null
          description_nl: string | null
          description_pt: string | null
          id: number
          img_url: string | null
          is_corrected: boolean | null
          is_free: boolean | null
          is_new: boolean | null
          is_original: boolean | null
          level: string | null
          published_at: string | null
          status: string
          title: string | null
          title_de: string | null
          title_es: string | null
          title_fr: string | null
          title_it: string | null
          title_ja: string | null
          title_nl: string | null
          title_pt: string | null
        }
        Insert: {
          accent?: string | null
          audio_url?: string | null
          author?: string | null
          category_1?: string | null
          category_2?: string | null
          category_3?: string | null
          content?: string | null
          content_multi?: Json | null
          content_type: number
          created_at?: string
          date_creation?: string | null
          description?: string | null
          description_de?: string | null
          description_es?: string | null
          description_fr?: string | null
          description_it?: string | null
          description_ja?: string | null
          description_nl?: string | null
          description_pt?: string | null
          id?: number
          img_url?: string | null
          is_corrected?: boolean | null
          is_free?: boolean | null
          is_new?: boolean | null
          is_original?: boolean | null
          level?: string | null
          published_at?: string | null
          status?: string
          title?: string | null
          title_de?: string | null
          title_es?: string | null
          title_fr?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Update: {
          accent?: string | null
          audio_url?: string | null
          author?: string | null
          category_1?: string | null
          category_2?: string | null
          category_3?: string | null
          content?: string | null
          content_multi?: Json | null
          content_type?: number
          created_at?: string
          date_creation?: string | null
          description?: string | null
          description_de?: string | null
          description_es?: string | null
          description_fr?: string | null
          description_it?: string | null
          description_ja?: string | null
          description_nl?: string | null
          description_pt?: string | null
          id?: number
          img_url?: string | null
          is_corrected?: boolean | null
          is_free?: boolean | null
          is_new?: boolean | null
          is_original?: boolean | null
          level?: string | null
          published_at?: string | null
          status?: string
          title?: string | null
          title_de?: string | null
          title_es?: string | null
          title_fr?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Relationships: []
      }
      en_flashcards: {
        Row: {
          audio_url: string | null
          basis: string | null
          chapter_id: number | null
          content_id: number | null
          created_at: string
          example: string | null
          example_translation: string | null
          finished_datetime: string | null
          function: string | null
          id: number
          proper_name: boolean | null
          status: string | null
          text: string | null
          text_translation: string | null
          user_id: string | null
          vocabulary_id: number | null
        }
        Insert: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_id?: number | null
          created_at?: string
          example?: string | null
          example_translation?: string | null
          finished_datetime?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          status?: string | null
          text?: string | null
          text_translation?: string | null
          user_id?: string | null
          vocabulary_id?: number | null
        }
        Update: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_id?: number | null
          created_at?: string
          example?: string | null
          example_translation?: string | null
          finished_datetime?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          status?: string | null
          text?: string | null
          text_translation?: string | null
          user_id?: string | null
          vocabulary_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_fr_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "en_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_fr_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_fr_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            isOneToOne: false
            referencedRelation: "en_vocabulary"
            referencedColumns: ["id"]
          },
        ]
      }
      en_progress: {
        Row: {
          chapter_id: number | null
          content_id: number | null
          content_type: number | null
          created_at: string
          finished_datetime: string | null
          id: number
          is_liked: boolean | null
          reading_status: string | null
          started_datetime: string | null
          user_id: string | null
        }
        Insert: {
          chapter_id?: number | null
          content_id?: number | null
          content_type?: number | null
          created_at?: string
          finished_datetime?: string | null
          id?: number
          is_liked?: boolean | null
          reading_status?: string | null
          started_datetime?: string | null
          user_id?: string | null
        }
        Update: {
          chapter_id?: number | null
          content_id?: number | null
          content_type?: number | null
          created_at?: string
          finished_datetime?: string | null
          id?: number
          is_liked?: boolean | null
          reading_status?: string | null
          started_datetime?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_fr_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "en_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_fr_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      en_quiz_models: {
        Row: {
          answer_1: string | null
          answer_2: string | null
          answer_3: string | null
          answer_4: string | null
          chapter_id: number | null
          correct_answer: number
          created_at: string
          id: number
          question: string | null
          quiz_id: number | null
          reference_id: number | null
          tip: string | null
          type: number | null
        }
        Insert: {
          answer_1?: string | null
          answer_2?: string | null
          answer_3?: string | null
          answer_4?: string | null
          chapter_id?: number | null
          correct_answer: number
          created_at?: string
          id?: number
          question?: string | null
          quiz_id?: number | null
          reference_id?: number | null
          tip?: string | null
          type?: number | null
        }
        Update: {
          answer_1?: string | null
          answer_2?: string | null
          answer_3?: string | null
          answer_4?: string | null
          chapter_id?: number | null
          correct_answer?: number
          created_at?: string
          id?: number
          question?: string | null
          quiz_id?: number | null
          reference_id?: number | null
          tip?: string | null
          type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quizz_models_fr_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "en_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizz_models_fr_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "en_content"
            referencedColumns: ["id"]
          },
        ]
      }
      en_quiz_results: {
        Row: {
          created_at: string
          filled_out: boolean | null
          finished_datetime: string | null
          id: number
          number_correct_answers: number | null
          quiz_id: number | null
          reference_id: number | null
          type: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          filled_out?: boolean | null
          finished_datetime?: string | null
          id?: number
          number_correct_answers?: number | null
          quiz_id?: number | null
          reference_id?: number | null
          type?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          filled_out?: boolean | null
          finished_datetime?: string | null
          id?: number
          number_correct_answers?: number | null
          quiz_id?: number | null
          reference_id?: number | null
          type?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_fr_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "en_quiz_models"
            referencedColumns: ["id"]
          },
        ]
      }
      en_vocabulary: {
        Row: {
          audio_url: string | null
          basis: string | null
          chapter_id: number | null
          content_type: number | null
          created_at: string
          example: string | null
          example_de: string | null
          example_es: string | null
          example_fr: string | null
          example_it: string | null
          example_ja: string | null
          example_nl: string | null
          example_pt: string | null
          function: string | null
          id: number
          proper_name: boolean | null
          reference_id: number | null
          text: string | null
          text_de: string | null
          text_es: string | null
          text_fr: string | null
          text_it: string | null
          text_ja: string | null
          text_nl: string | null
          text_pt: string | null
        }
        Insert: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_type?: number | null
          created_at?: string
          example?: string | null
          example_de?: string | null
          example_es?: string | null
          example_fr?: string | null
          example_it?: string | null
          example_ja?: string | null
          example_nl?: string | null
          example_pt?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          reference_id?: number | null
          text?: string | null
          text_de?: string | null
          text_es?: string | null
          text_fr?: string | null
          text_it?: string | null
          text_ja?: string | null
          text_nl?: string | null
          text_pt?: string | null
        }
        Update: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_type?: number | null
          created_at?: string
          example?: string | null
          example_de?: string | null
          example_es?: string | null
          example_fr?: string | null
          example_it?: string | null
          example_ja?: string | null
          example_nl?: string | null
          example_pt?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          reference_id?: number | null
          text?: string | null
          text_de?: string | null
          text_es?: string | null
          text_fr?: string | null
          text_it?: string | null
          text_ja?: string | null
          text_nl?: string | null
          text_pt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_fr_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "en_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vocabulary_fr_reference_id_fkey1"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "en_content"
            referencedColumns: ["id"]
          },
        ]
      }
      es_chapters: {
        Row: {
          audio_url: string | null
          content: string | null
          content_multi: Json | null
          created_at: string
          description: string | null
          duration: number | null
          id: number
          image_url: string | null
          is_corrected: boolean | null
          long_format_id: number | null
          order_id: number | null
          reviewed: number | null
          title: string | null
          title_de: string | null
          title_en: string | null
          title_fr: string | null
          title_it: string | null
          title_ja: string | null
          title_nl: string | null
          title_pt: string | null
        }
        Insert: {
          audio_url?: string | null
          content?: string | null
          content_multi?: Json | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: number
          image_url?: string | null
          is_corrected?: boolean | null
          long_format_id?: number | null
          order_id?: number | null
          reviewed?: number | null
          title?: string | null
          title_de?: string | null
          title_en?: string | null
          title_fr?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Update: {
          audio_url?: string | null
          content?: string | null
          content_multi?: Json | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: number
          image_url?: string | null
          is_corrected?: boolean | null
          long_format_id?: number | null
          order_id?: number | null
          reviewed?: number | null
          title?: string | null
          title_de?: string | null
          title_en?: string | null
          title_fr?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_fr_long_format_id_fkey"
            columns: ["long_format_id"]
            isOneToOne: false
            referencedRelation: "es_content"
            referencedColumns: ["id"]
          },
        ]
      }
      es_content: {
        Row: {
          accent: string | null
          audio_url: string | null
          author: string | null
          category_1: string | null
          category_2: string | null
          category_3: string | null
          content: string | null
          content_multi: Json | null
          content_type: number
          created_at: string
          date_creation: string | null
          description: string | null
          description_de: string | null
          description_en: string | null
          description_fr: string | null
          description_it: string | null
          description_ja: string | null
          description_nl: string | null
          description_pt: string | null
          id: number
          img_url: string | null
          is_corrected: boolean | null
          is_free: boolean | null
          is_new: boolean | null
          is_original: boolean | null
          level: string | null
          published_at: string | null
          status: string
          title: string | null
          title_de: string | null
          title_en: string | null
          title_fr: string | null
          title_it: string | null
          title_ja: string | null
          title_nl: string | null
          title_pt: string | null
        }
        Insert: {
          accent?: string | null
          audio_url?: string | null
          author?: string | null
          category_1?: string | null
          category_2?: string | null
          category_3?: string | null
          content?: string | null
          content_multi?: Json | null
          content_type: number
          created_at?: string
          date_creation?: string | null
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_it?: string | null
          description_ja?: string | null
          description_nl?: string | null
          description_pt?: string | null
          id?: number
          img_url?: string | null
          is_corrected?: boolean | null
          is_free?: boolean | null
          is_new?: boolean | null
          is_original?: boolean | null
          level?: string | null
          published_at?: string | null
          status?: string
          title?: string | null
          title_de?: string | null
          title_en?: string | null
          title_fr?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Update: {
          accent?: string | null
          audio_url?: string | null
          author?: string | null
          category_1?: string | null
          category_2?: string | null
          category_3?: string | null
          content?: string | null
          content_multi?: Json | null
          content_type?: number
          created_at?: string
          date_creation?: string | null
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_it?: string | null
          description_ja?: string | null
          description_nl?: string | null
          description_pt?: string | null
          id?: number
          img_url?: string | null
          is_corrected?: boolean | null
          is_free?: boolean | null
          is_new?: boolean | null
          is_original?: boolean | null
          level?: string | null
          published_at?: string | null
          status?: string
          title?: string | null
          title_de?: string | null
          title_en?: string | null
          title_fr?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Relationships: []
      }
      es_flashcards: {
        Row: {
          audio_url: string | null
          basis: string | null
          chapter_id: number | null
          content_id: number | null
          created_at: string
          example: string | null
          example_translation: string | null
          finished_datetime: string | null
          function: string | null
          id: number
          proper_name: boolean | null
          status: string | null
          text: string | null
          text_translation: string | null
          user_id: string | null
          vocabulary_id: number | null
        }
        Insert: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_id?: number | null
          created_at?: string
          example?: string | null
          example_translation?: string | null
          finished_datetime?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          status?: string | null
          text?: string | null
          text_translation?: string | null
          user_id?: string | null
          vocabulary_id?: number | null
        }
        Update: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_id?: number | null
          created_at?: string
          example?: string | null
          example_translation?: string | null
          finished_datetime?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          status?: string | null
          text?: string | null
          text_translation?: string | null
          user_id?: string | null
          vocabulary_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_fr_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "es_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_fr_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_fr_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            isOneToOne: false
            referencedRelation: "es_vocabulary"
            referencedColumns: ["id"]
          },
        ]
      }
      es_progress: {
        Row: {
          chapter_id: number | null
          content_id: number | null
          content_type: number | null
          created_at: string
          finished_datetime: string | null
          id: number
          is_liked: boolean | null
          reading_status: string | null
          started_datetime: string | null
          user_id: string | null
        }
        Insert: {
          chapter_id?: number | null
          content_id?: number | null
          content_type?: number | null
          created_at?: string
          finished_datetime?: string | null
          id?: number
          is_liked?: boolean | null
          reading_status?: string | null
          started_datetime?: string | null
          user_id?: string | null
        }
        Update: {
          chapter_id?: number | null
          content_id?: number | null
          content_type?: number | null
          created_at?: string
          finished_datetime?: string | null
          id?: number
          is_liked?: boolean | null
          reading_status?: string | null
          started_datetime?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_fr_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "es_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_fr_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      es_quiz_models: {
        Row: {
          answer_1: string | null
          answer_2: string | null
          answer_3: string | null
          answer_4: string | null
          chapter_id: number | null
          correct_answer: number
          created_at: string
          id: number
          question: string | null
          quiz_id: number | null
          reference_id: number | null
          tip: string | null
          type: number | null
        }
        Insert: {
          answer_1?: string | null
          answer_2?: string | null
          answer_3?: string | null
          answer_4?: string | null
          chapter_id?: number | null
          correct_answer: number
          created_at?: string
          id?: number
          question?: string | null
          quiz_id?: number | null
          reference_id?: number | null
          tip?: string | null
          type?: number | null
        }
        Update: {
          answer_1?: string | null
          answer_2?: string | null
          answer_3?: string | null
          answer_4?: string | null
          chapter_id?: number | null
          correct_answer?: number
          created_at?: string
          id?: number
          question?: string | null
          quiz_id?: number | null
          reference_id?: number | null
          tip?: string | null
          type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quizz_models_fr_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "es_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizz_models_fr_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "es_content"
            referencedColumns: ["id"]
          },
        ]
      }
      es_quiz_results: {
        Row: {
          created_at: string
          filled_out: boolean | null
          finished_datetime: string | null
          id: number
          number_correct_answers: number | null
          quiz_id: number | null
          reference_id: number | null
          type: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          filled_out?: boolean | null
          finished_datetime?: string | null
          id?: number
          number_correct_answers?: number | null
          quiz_id?: number | null
          reference_id?: number | null
          type?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          filled_out?: boolean | null
          finished_datetime?: string | null
          id?: number
          number_correct_answers?: number | null
          quiz_id?: number | null
          reference_id?: number | null
          type?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_fr_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "es_quiz_models"
            referencedColumns: ["id"]
          },
        ]
      }
      es_vocabulary: {
        Row: {
          audio_url: string | null
          basis: string | null
          chapter_id: number | null
          content_type: number | null
          created_at: string
          example: string | null
          example_de: string | null
          example_en: string | null
          example_fr: string | null
          example_it: string | null
          example_ja: string | null
          example_nl: string | null
          example_pt: string | null
          function: string | null
          id: number
          proper_name: boolean | null
          reference_id: number | null
          text: string | null
          text_de: string | null
          text_en: string | null
          text_fr: string | null
          text_it: string | null
          text_ja: string | null
          text_nl: string | null
          text_pt: string | null
        }
        Insert: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_type?: number | null
          created_at?: string
          example?: string | null
          example_de?: string | null
          example_en?: string | null
          example_fr?: string | null
          example_it?: string | null
          example_ja?: string | null
          example_nl?: string | null
          example_pt?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          reference_id?: number | null
          text?: string | null
          text_de?: string | null
          text_en?: string | null
          text_fr?: string | null
          text_it?: string | null
          text_ja?: string | null
          text_nl?: string | null
          text_pt?: string | null
        }
        Update: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_type?: number | null
          created_at?: string
          example?: string | null
          example_de?: string | null
          example_en?: string | null
          example_fr?: string | null
          example_it?: string | null
          example_ja?: string | null
          example_nl?: string | null
          example_pt?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          reference_id?: number | null
          text?: string | null
          text_de?: string | null
          text_en?: string | null
          text_fr?: string | null
          text_it?: string | null
          text_ja?: string | null
          text_nl?: string | null
          text_pt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_fr_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "es_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vocabulary_fr_reference_id_fkey1"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "es_content"
            referencedColumns: ["id"]
          },
        ]
      }
      fr_chapters: {
        Row: {
          audio_url: string | null
          content: string | null
          content_multi: Json | null
          created_at: string
          description: string | null
          duration: number | null
          id: number
          image_url: string | null
          is_corrected: boolean | null
          long_format_id: number | null
          order_id: number | null
          title: string | null
          title_de: string | null
          title_en: string | null
          title_es: string | null
          title_it: string | null
          title_ja: string | null
          title_nl: string | null
          title_pt: string | null
        }
        Insert: {
          audio_url?: string | null
          content?: string | null
          content_multi?: Json | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: number
          image_url?: string | null
          is_corrected?: boolean | null
          long_format_id?: number | null
          order_id?: number | null
          title?: string | null
          title_de?: string | null
          title_en?: string | null
          title_es?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Update: {
          audio_url?: string | null
          content?: string | null
          content_multi?: Json | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: number
          image_url?: string | null
          is_corrected?: boolean | null
          long_format_id?: number | null
          order_id?: number | null
          title?: string | null
          title_de?: string | null
          title_en?: string | null
          title_es?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_fr_long_format_id_fkey"
            columns: ["long_format_id"]
            isOneToOne: false
            referencedRelation: "fr_content"
            referencedColumns: ["id"]
          },
        ]
      }
      fr_content: {
        Row: {
          accent: string | null
          audio_url: string | null
          author: string | null
          category_1: string | null
          category_2: string | null
          category_3: string | null
          category_4: string | null
          content: string | null
          content_multi: Json | null
          content_type: number
          created_at: string
          date_creation: string | null
          description: string | null
          description_de: string | null
          description_en: string | null
          description_es: string | null
          description_it: string | null
          description_ja: string | null
          description_nl: string | null
          description_pt: string | null
          id: number
          img_url: string | null
          is_corrected: boolean | null
          is_free: boolean | null
          is_new: boolean | null
          is_original: boolean | null
          level: string | null
          published_at: string | null
          status: string
          title: string | null
          title_de: string | null
          title_en: string | null
          title_es: string | null
          title_it: string | null
          title_ja: string | null
          title_nl: string | null
          title_pt: string | null
        }
        Insert: {
          accent?: string | null
          audio_url?: string | null
          author?: string | null
          category_1?: string | null
          category_2?: string | null
          category_3?: string | null
          category_4?: string | null
          content?: string | null
          content_multi?: Json | null
          content_type: number
          created_at?: string
          date_creation?: string | null
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          description_es?: string | null
          description_it?: string | null
          description_ja?: string | null
          description_nl?: string | null
          description_pt?: string | null
          id?: number
          img_url?: string | null
          is_corrected?: boolean | null
          is_free?: boolean | null
          is_new?: boolean | null
          is_original?: boolean | null
          level?: string | null
          published_at?: string | null
          status?: string
          title?: string | null
          title_de?: string | null
          title_en?: string | null
          title_es?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Update: {
          accent?: string | null
          audio_url?: string | null
          author?: string | null
          category_1?: string | null
          category_2?: string | null
          category_3?: string | null
          category_4?: string | null
          content?: string | null
          content_multi?: Json | null
          content_type?: number
          created_at?: string
          date_creation?: string | null
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          description_es?: string | null
          description_it?: string | null
          description_ja?: string | null
          description_nl?: string | null
          description_pt?: string | null
          id?: number
          img_url?: string | null
          is_corrected?: boolean | null
          is_free?: boolean | null
          is_new?: boolean | null
          is_original?: boolean | null
          level?: string | null
          published_at?: string | null
          status?: string
          title?: string | null
          title_de?: string | null
          title_en?: string | null
          title_es?: string | null
          title_it?: string | null
          title_ja?: string | null
          title_nl?: string | null
          title_pt?: string | null
        }
        Relationships: []
      }
      fr_flashcards: {
        Row: {
          audio_url: string | null
          basis: string | null
          chapter_id: number | null
          content_id: number | null
          created_at: string
          example: string | null
          example_translation: string | null
          finished_datetime: string | null
          function: string | null
          id: number
          proper_name: boolean | null
          status: string | null
          text: string | null
          text_translation: string | null
          user_id: string | null
          vocabulary_id: number | null
        }
        Insert: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_id?: number | null
          created_at?: string
          example?: string | null
          example_translation?: string | null
          finished_datetime?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          status?: string | null
          text?: string | null
          text_translation?: string | null
          user_id?: string | null
          vocabulary_id?: number | null
        }
        Update: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_id?: number | null
          created_at?: string
          example?: string | null
          example_translation?: string | null
          finished_datetime?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          status?: string | null
          text?: string | null
          text_translation?: string | null
          user_id?: string | null
          vocabulary_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_fr_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "fr_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_fr_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_fr_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            isOneToOne: false
            referencedRelation: "fr_vocabulary"
            referencedColumns: ["id"]
          },
        ]
      }
      fr_progress: {
        Row: {
          chapter_id: number | null
          content_id: number | null
          content_type: number | null
          created_at: string
          finished_datetime: string | null
          id: number
          is_liked: boolean | null
          reading_status: string | null
          started_datetime: string | null
          user_id: string | null
        }
        Insert: {
          chapter_id?: number | null
          content_id?: number | null
          content_type?: number | null
          created_at?: string
          finished_datetime?: string | null
          id?: number
          is_liked?: boolean | null
          reading_status?: string | null
          started_datetime?: string | null
          user_id?: string | null
        }
        Update: {
          chapter_id?: number | null
          content_id?: number | null
          content_type?: number | null
          created_at?: string
          finished_datetime?: string | null
          id?: number
          is_liked?: boolean | null
          reading_status?: string | null
          started_datetime?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_fr_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "fr_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_fr_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fr_quiz_models: {
        Row: {
          answer_1: string | null
          answer_2: string | null
          answer_3: string | null
          answer_4: string | null
          chapter_id: number | null
          correct_answer: number
          created_at: string
          id: number
          question: string | null
          quiz_id: number | null
          reference_id: number | null
          tip: string | null
          type: number | null
        }
        Insert: {
          answer_1?: string | null
          answer_2?: string | null
          answer_3?: string | null
          answer_4?: string | null
          chapter_id?: number | null
          correct_answer: number
          created_at?: string
          id?: number
          question?: string | null
          quiz_id?: number | null
          reference_id?: number | null
          tip?: string | null
          type?: number | null
        }
        Update: {
          answer_1?: string | null
          answer_2?: string | null
          answer_3?: string | null
          answer_4?: string | null
          chapter_id?: number | null
          correct_answer?: number
          created_at?: string
          id?: number
          question?: string | null
          quiz_id?: number | null
          reference_id?: number | null
          tip?: string | null
          type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quizz_models_fr_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "fr_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizz_models_fr_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "fr_content"
            referencedColumns: ["id"]
          },
        ]
      }
      fr_quiz_results: {
        Row: {
          created_at: string
          filled_out: boolean | null
          finished_datetime: string | null
          id: number
          number_correct_answers: number | null
          quiz_id: number | null
          reference_id: number | null
          type: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          filled_out?: boolean | null
          finished_datetime?: string | null
          id?: number
          number_correct_answers?: number | null
          quiz_id?: number | null
          reference_id?: number | null
          type?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          filled_out?: boolean | null
          finished_datetime?: string | null
          id?: number
          number_correct_answers?: number | null
          quiz_id?: number | null
          reference_id?: number | null
          type?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_fr_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "fr_quiz_models"
            referencedColumns: ["id"]
          },
        ]
      }
      fr_videos: {
        Row: {
          accent: string | null
          caption_type: string
          category: string
          channel_avatar_url: string | null
          channel_id: string
          channel_title: string
          content: Json | null
          created_at: string
          description: string | null
          description_de: string | null
          description_en: string | null
          description_es: string | null
          description_it: string | null
          description_ja: string | null
          description_nl: string | null
          description_pt: string | null
          duration_seconds: number | null
          has_captions: boolean
          id: number
          is_embeddable: boolean
          is_featured: boolean
          last_checked_at: string | null
          level: string | null
          published_at: string | null
          region_restriction: string[] | null
          speech_rate: string | null
          status: string
          theme_1: string | null
          theme_2: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          youtube_id: string
        }
        Insert: {
          accent?: string | null
          caption_type?: string
          category: string
          channel_avatar_url?: string | null
          channel_id: string
          channel_title: string
          content?: Json | null
          created_at?: string
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          description_es?: string | null
          description_it?: string | null
          description_ja?: string | null
          description_nl?: string | null
          description_pt?: string | null
          duration_seconds?: number | null
          has_captions?: boolean
          id?: never
          is_embeddable?: boolean
          is_featured?: boolean
          last_checked_at?: string | null
          level?: string | null
          published_at?: string | null
          region_restriction?: string[] | null
          speech_rate?: string | null
          status?: string
          theme_1?: string | null
          theme_2?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          youtube_id: string
        }
        Update: {
          accent?: string | null
          caption_type?: string
          category?: string
          channel_avatar_url?: string | null
          channel_id?: string
          channel_title?: string
          content?: Json | null
          created_at?: string
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          description_es?: string | null
          description_it?: string | null
          description_ja?: string | null
          description_nl?: string | null
          description_pt?: string | null
          duration_seconds?: number | null
          has_captions?: boolean
          id?: never
          is_embeddable?: boolean
          is_featured?: boolean
          last_checked_at?: string | null
          level?: string | null
          published_at?: string | null
          region_restriction?: string[] | null
          speech_rate?: string | null
          status?: string
          theme_1?: string | null
          theme_2?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          youtube_id?: string
        }
        Relationships: []
      }
      fr_vocabulary: {
        Row: {
          audio_url: string | null
          basis: string | null
          chapter_id: number | null
          content_type: number | null
          created_at: string
          example: string | null
          example_de: string | null
          example_en: string | null
          example_es: string | null
          example_it: string | null
          example_ja: string | null
          example_nl: string | null
          example_pt: string | null
          function: string | null
          id: number
          proper_name: boolean | null
          reference_id: number | null
          text: string | null
          text_de: string | null
          text_en: string | null
          text_es: string | null
          text_it: string | null
          text_ja: string | null
          text_nl: string | null
          text_pt: string | null
        }
        Insert: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_type?: number | null
          created_at?: string
          example?: string | null
          example_de?: string | null
          example_en?: string | null
          example_es?: string | null
          example_it?: string | null
          example_ja?: string | null
          example_nl?: string | null
          example_pt?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          reference_id?: number | null
          text?: string | null
          text_de?: string | null
          text_en?: string | null
          text_es?: string | null
          text_it?: string | null
          text_ja?: string | null
          text_nl?: string | null
          text_pt?: string | null
        }
        Update: {
          audio_url?: string | null
          basis?: string | null
          chapter_id?: number | null
          content_type?: number | null
          created_at?: string
          example?: string | null
          example_de?: string | null
          example_en?: string | null
          example_es?: string | null
          example_it?: string | null
          example_ja?: string | null
          example_nl?: string | null
          example_pt?: string | null
          function?: string | null
          id?: number
          proper_name?: boolean | null
          reference_id?: number | null
          text?: string | null
          text_de?: string | null
          text_en?: string | null
          text_es?: string | null
          text_it?: string | null
          text_ja?: string | null
          text_nl?: string | null
          text_pt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_fr_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "fr_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vocabulary_fr_reference_id_fkey1"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "fr_content"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_premium: boolean | null
          last_new_content_notification_at: string | null
          last_reminder_at: string | null
          level: string | null
          native_language: string | null
          notification_tokens: string[]
          notification_tokens_updated_at: string | null
          notifications_enabled: boolean | null
          reminder_enabled: boolean
          reminder_time: string | null
          role: string
          target_language: string | null
          theme_interest_1: string | null
          theme_interest_2: string | null
          theme_interest_3: string | null
          theme_interest_4: string | null
          theme_interest_5: string | null
          timezone: string | null
          trial_ends_at: string | null
          trial_reminder_sent_at: string | null
          updated_at: string | null
          weekly_goal: number | null
        }
        Insert: {
          avatar?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_premium?: boolean | null
          last_new_content_notification_at?: string | null
          last_reminder_at?: string | null
          level?: string | null
          native_language?: string | null
          notification_tokens?: string[]
          notification_tokens_updated_at?: string | null
          notifications_enabled?: boolean | null
          reminder_enabled?: boolean
          reminder_time?: string | null
          role?: string
          target_language?: string | null
          theme_interest_1?: string | null
          theme_interest_2?: string | null
          theme_interest_3?: string | null
          theme_interest_4?: string | null
          theme_interest_5?: string | null
          timezone?: string | null
          trial_ends_at?: string | null
          trial_reminder_sent_at?: string | null
          updated_at?: string | null
          weekly_goal?: number | null
        }
        Update: {
          avatar?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_premium?: boolean | null
          last_new_content_notification_at?: string | null
          last_reminder_at?: string | null
          level?: string | null
          native_language?: string | null
          notification_tokens?: string[]
          notification_tokens_updated_at?: string | null
          notifications_enabled?: boolean | null
          reminder_enabled?: boolean
          reminder_time?: string | null
          role?: string
          target_language?: string | null
          theme_interest_1?: string | null
          theme_interest_2?: string | null
          theme_interest_3?: string | null
          theme_interest_4?: string | null
          theme_interest_5?: string | null
          timezone?: string | null
          trial_ends_at?: string | null
          trial_reminder_sent_at?: string | null
          updated_at?: string | null
          weekly_goal?: number | null
        }
        Relationships: []
      }
      translation_reports: {
        Row: {
          chapter_id: number | null
          content_id: number | null
          context_sentence: string | null
          created_at: string
          details: string | null
          id: number
          native_language: string
          reported_translation: string
          target_language: string
          user_id: string
          word: string
          word_type: string | null
        }
        Insert: {
          chapter_id?: number | null
          content_id?: number | null
          context_sentence?: string | null
          created_at?: string
          details?: string | null
          id?: never
          native_language: string
          reported_translation: string
          target_language: string
          user_id: string
          word: string
          word_type?: string | null
        }
        Update: {
          chapter_id?: number | null
          content_id?: number | null
          context_sentence?: string | null
          created_at?: string
          details?: string | null
          id?: never
          native_language?: string
          reported_translation?: string
          target_language?: string
          user_id?: string
          word?: string
          word_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assert_content_language: { Args: { lang: string }; Returns: string }
      check_rate_limit: {
        Args: { p_daily_limit: number; p_function_name: string }
        Returns: boolean
      }
      content_readiness: {
        Args: { content_id: number; lang: string }
        Returns: {
          problem: string
        }[]
      }
      count_new_content_for_language: {
        Args: {
          p_content_type: number
          p_since: string
          p_target_language: string
        }
        Returns: number
      }
      get_profiles_for_trial_reminder: {
        Args: { p_now?: string }
        Returns: {
          native_language: string
          notification_tokens: string[]
          profile_id: string
        }[]
      }
      get_profiles_to_notify: {
        Args: { p_now?: string; p_window_minutes?: number }
        Returns: {
          native_language: string
          notification_tokens: string[]
          profile_id: string
          reason: string
          target_language: string
        }[]
      }
      has_readable_paragraphs: { Args: { blob: Json }; Returns: boolean }
      ingest_content: { Args: { lang: string; payload: Json }; Returns: number }
      is_content_admin: { Args: never; Returns: boolean }
      mark_profiles_new_content_notified: {
        Args: { p_notified_at?: string; p_profile_ids: string[] }
        Returns: number
      }
      mark_profiles_reminded: {
        Args: { p_profile_ids: string[]; p_reminded_at?: string }
        Returns: number
      }
      mark_trial_reminders_sent: {
        Args: { p_profile_ids: string[]; p_sent_at?: string }
        Returns: number
      }
      normalize_storage_path: { Args: { path: string }; Returns: string }
      publish_content: {
        Args: { content_id: number; lang: string }
        Returns: undefined
      }
      storage_object_exists: { Args: { path: string }; Returns: boolean }
      unpublish_content: {
        Args: { content_id: number; lang: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
