#ifndef __EG_FN_EXPORTS_H__
#define __EG_FN_EXPORTS_H__

#ifdef __cplusplus
extern "C" {
#endif 

#if !defined(EG_FN_EXPORT)
#  if !defined(_WIN32)
#    define EG_FN_EXPORT
#  else
#    if defined(EG_FN_INBUILD)
#      if !defined(EG_FN_STATIC)
#        define EG_FN_EXPORT __declspec(dllexport)
#      else
#        define EG_FN_EXPORT extern
#      endif
#    else
#      if !defined(EG_FN_STATIC)
#        define EG_FN_EXPORT __declspec(dllimport)
#      else
#        define EG_FN_EXPORT
#      endif
#    endif
#  endif
#endif

#if !defined(EG_FN_EXPORT_VAR)
#  if !defined(_WIN32)
#    define EG_FN_EXPORT_VAR extern
#  else
#    if defined(EG_FN_INBUILD)
#      if !defined(EG_FN_STATIC)
#        define EG_FN_EXPORT_VAR __declspec(dllexport) extern
#      else
#        define EG_FN_EXPORT_VAR extern
#      endif
#    else
#      if !defined(EG_FN_STATIC)
#        define EG_FN_EXPORT_VAR __declspec(dllimport) extern
#      else
#        define EG_FN_EXPORT_VAR extern
#      endif
#    endif
#  endif
#endif

#ifdef __cplusplus
}
#endif 

#endif /*__EG_FN_EXPORTS_H__*/
