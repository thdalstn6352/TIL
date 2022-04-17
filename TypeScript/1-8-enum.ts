{
  /**
   * Enum
   * Enum으로 할당된 변수에 새로운 값을 할당할 수 있는 것이 문제 즉, 타입이 정확하게 보장되지 않음. 따라서 Enum 타입 권장 x
  
  그러나, Enum 타입이 적합할 경우도 있다. 
  ex)
  type Errors = 'error message simple version' | 'error message complicated version' | 'error message complicated detail version';
  
  이렇게 복잡한 union대신

  enum Errors {
    Short: 'error message simple version' ,
    Long: 'error message complicated version',
    Detail: 'error message complicated detail version'
  }

  Errors.short => 'error message simple version'
  
  */





  // JavaScript
  const MAX_NUM = 6;
  const MAX_STUDENTS_PER_CLASS = 10;
  const MONDAY = 0;
  const TUESDAY = 1;
  const WEDNESDAY = 2;
  const DAYS_ENUM = Object.freeze({ MONDAY: 0, TUESDAY: 1, WEDNESDAY: 2 });
  const dayOfToday = DAYS_ENUM.MONDAY;

  // TypeScript
  type DaysOfWeek = 'Monday' | 'Tuesday' | 'Wednesday'; // 되도록 enum보다 이처럼 쓰는걸 권장.


  enum Days {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
  }
  console.log(Days.Monday);
  let day: Days = Days.Saturday;
  day = Days.Tuesday;
  day = 10;
  console.log(day);

  let dayOfweek: DaysOfWeek = 'Monday';
  dayOfweek = 'Wednesday';
}

