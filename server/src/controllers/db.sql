CREATE TABLE "public"."workout" (
  "id" int4 NOT NULL DEFAULT nextval('workout_id_seq'::regclass),
  "workout_number" int4 NOT NULL,
  "addition_id" int4,
  "series_id" int4,
  "muscle_group_id" int4 NOT NULL,
  "exercise_type_id" int4 NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "barbell_weight" numeric(5,2),
  "training_date" date DEFAULT CURRENT_DATE,
  "description" varchar(255) COLLATE "pg_catalog"."default",
  "description_position" varchar(255) COLLATE "pg_catalog"."default",
  "photo_filename " varchar(255) COLLATE "pg_catalog"."default",
  "one_sided_weight" bool,
  CONSTRAINT "workout_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "workout_exercise_type_id_fkey" FOREIGN KEY ("exercise_type_id") REFERENCES "public"."exercise_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "workout_muscle_group_id_fkey" FOREIGN KEY ("muscle_group_id") REFERENCES "public"."muscle_group" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
)
;

ALTER TABLE "public"."workout"
  OWNER TO "postgres";

COMMENT ON COLUMN "public"."workout"."id" IS 'Уникальный идентификатор тренировки';

COMMENT ON COLUMN "public"."workout"."workout_number" IS 'Номер тренировки';

COMMENT ON COLUMN "public"."workout"."addition_id" IS 'ID добавки (если упражнение является дополнением к другому)';

COMMENT ON COLUMN "public"."workout"."series_id" IS 'ID серии упражнения (если это часть серии)';

COMMENT ON COLUMN "public"."workout"."muscle_group_id" IS 'ID основной группы мышц';

COMMENT ON COLUMN "public"."workout"."exercise_type_id" IS 'ID типа упражнения';

COMMENT ON COLUMN "public"."workout"."title" IS 'Название упражнения';

COMMENT ON COLUMN "public"."workout"."barbell_weight" IS 'Вес штанги (если используется)';

COMMENT ON COLUMN "public"."workout"."training_date" IS 'Дата выполнения упражнения (по умолчанию - текущая)';

COMMENT ON COLUMN "public"."workout"."description" IS 'Текстовое описание упражнения: техника выполнения, целевые мышцы, важные моменты.';

COMMENT ON COLUMN "public"."workout"."description_position" IS 'Информация о положении тела во время выполнения упражнения: настройка скамьи, расположение конечностей, угол наклона.';

CREATE TABLE "public"."workout_set" (
  "id" int4 NOT NULL DEFAULT nextval('workout_set_id_seq'::regclass),
  "workout_id" int4 NOT NULL,
  "set_number" int4,
  "weight" numeric(5,2) NOT NULL,
  "repetitions" int4 NOT NULL,
  CONSTRAINT "workout_set_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "workout_set_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workout" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT "workout_set_set_number_check" CHECK (set_number >= 1 AND set_number <= 10)
)
;

ALTER TABLE "public"."workout_set"
  OWNER TO "postgres";

COMMENT ON COLUMN "public"."workout_set"."id" IS 'Уникальный идентификатор подхода';

COMMENT ON COLUMN "public"."workout_set"."workout_id" IS 'ID тренировки';

COMMENT ON COLUMN "public"."workout_set"."set_number" IS 'Номер подхода (1-10)';

COMMENT ON COLUMN "public"."workout_set"."weight" IS 'Вес снаряда в килограммах';

COMMENT ON COLUMN "public"."workout_set"."repetitions" IS 'Количество повторений';

CREATE TABLE "public"."muscle_group" (
  "id" int4 NOT NULL DEFAULT nextval('muscle_group_id_seq'::regclass),
  "name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  CONSTRAINT "muscle_group_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "muscle_group_name_key" UNIQUE ("name")
)
;

ALTER TABLE "public"."muscle_group"
  OWNER TO "postgres";

COMMENT ON COLUMN "public"."muscle_group"."id" IS 'Уникальный идентификатор группы мышц';

COMMENT ON COLUMN "public"."muscle_group"."name" IS 'Название группы мышц';

CREATE TABLE "public"."exercise_type" (
  "id" int4 NOT NULL DEFAULT nextval('exercise_type_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  CONSTRAINT "exercise_type_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "exercise_type_name_key" UNIQUE ("name")
)
;

ALTER TABLE "public"."exercise_type"
  OWNER TO "postgres";

COMMENT ON COLUMN "public"."exercise_type"."id" IS 'Уникальный идентификатор типа упражнения';

COMMENT ON COLUMN "public"."exercise_type"."name" IS 'Название типа упражнения';